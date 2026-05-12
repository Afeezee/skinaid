export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const requestBody = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
  const { imageBase64, imageUrl, mimeType = 'image/jpeg', symptomText = '' } = requestBody || {}
  const trimmedSymptomText = typeof symptomText === 'string' ? symptomText.trim() : ''

  if (!imageBase64 && !imageUrl) {
    return res.status(400).json({ error: 'imageBase64 or imageUrl is required' })
  }

  if (trimmedSymptomText.length > 1500) {
    return res.status(400).json({ error: 'symptomText must be 1500 characters or fewer' })
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY
  if (!GROQ_API_KEY) {
    return res.status(500).json({ error: 'AI service not configured' })
  }

  const systemPrompt = `You are a professional dermatology screening assistant integrated into a medical-grade AI health application. Your role is to analyse skin images and provide preliminary assessments to help users understand possible skin conditions and determine if they need professional medical attention.

IMPORTANT RULES:
- You are NOT a doctor and cannot diagnose conditions
- Always encourage professional medical consultation for any concerning findings
- Be informative but appropriately cautious
- Never cause unnecessary alarm, but never dismiss concerning signs
- Consider any user-reported symptoms or concerns as supporting context, but do not over-trust them if they conflict with what is visible in the image
- If the symptom description and image seem inconsistent, say so clearly in the description or advice

Analyse the provided skin image and respond ONLY with a valid JSON object (no markdown, no preamble) in this exact structure:

{
  "condition": "Most likely condition name or 'No visible concern'",
  "confidence": "low | medium | high",
  "description": "Clear, plain-English description of what is observed in the image",
  "characteristics": ["list", "of", "observed", "visual", "features"],
  "severity": "none | mild | moderate | severe",
  "urgency": "routine | soon | urgent",
  "advice": "Specific actionable advice for the user",
  "disclaimer": "Always consult a qualified dermatologist or healthcare professional for an accurate diagnosis and treatment plan.",
  "seek_professional": true or false
}`

  const imageInput = imageUrl || `data:${mimeType};base64,${imageBase64}`
  const userPrompt = trimmedSymptomText
    ? `Please analyse this skin image and the user-reported symptom details below, then return your assessment as JSON.

User-reported symptom details:
${trimmedSymptomText}`
    : 'Please analyse this skin image and return your assessment as JSON.'

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-4-scout-17b-16e-instruct',
        max_completion_tokens: 1024,
        temperature: 0.2,
        top_p: 1,
        stream: false,
        response_format: { type: 'json_object' },
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: userPrompt,
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageInput,
                },
              },
            ],
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      console.error('Groq API error:', errorBody)

      let parsedError = null
      try {
        parsedError = JSON.parse(errorBody)
      } catch {
        parsedError = null
      }

      const providerError = parsedError?.error ?? parsedError ?? {}

      const rateLimited =
        response.status === 429 ||
        providerError?.code === 'request_quota_exceeded' ||
        providerError?.type === 'too_many_requests_error'

      const imageTooLarge =
        response.status === 413 ||
        providerError?.message?.includes('Maximum allowed size') ||
        providerError?.message?.includes('Request too large')

      if (imageTooLarge) {
        return res.status(413).json({
          error: 'Image is too large for analysis',
          message: 'Please upload a smaller image or a lower-resolution version and try again.',
        })
      }

      if (rateLimited) {
        return res.status(503).json({
          error: 'AI service temporarily unavailable',
          message: 'The Groq inference service is currently rate-limited or under heavy load. Please try again in a moment.',
        })
      }

      return res.status(502).json({ error: 'AI service error', details: errorBody })
    }

    const data = await response.json()
    const rawContent = data.choices?.[0]?.message?.content

    if (!rawContent) {
      return res.status(502).json({ error: 'Empty response from AI model' })
    }

    let result

    try {
      result = JSON.parse(rawContent)
    } catch {
      const jsonMatch = rawContent.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0])
      } else {
        return res.status(502).json({ error: 'Invalid JSON from AI model', raw: rawContent })
      }
    }

    return res.status(200).json({ success: true, result })
  } catch (err) {
    console.error('Analysis error:', err)
    return res.status(500).json({ error: 'Internal server error', message: err.message })
  }
}