import React, { useEffect, useState } from "react";
import {
  AlertCircle,
  Camera,
  ExternalLink,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  UploadCloud,
} from "lucide-react";

import LoadingSpinner from "@/components/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Disclaimer from "@/components/ui/Disclaimer";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";
import { createSkinCheck } from "@/lib/db";
import { deleteSkinImage, uploadSkinImage } from "@/lib/storage";

const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_SYMPTOM_TEXT_LENGTH = 1500;

function getConfidenceBadgeClass(confidence = "low") {
  const normalizedConfidence = confidence.toLowerCase();

  if (normalizedConfidence === "high") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  if (normalizedConfidence === "medium") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-red-200 bg-red-50 text-red-700";
}

function getSeverityBadgeClass(severity = "none") {
  const normalizedSeverity = severity.toLowerCase();

  if (normalizedSeverity === "severe") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (normalizedSeverity === "moderate") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (normalizedSeverity === "mild") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700";
  }

  return "border-slate-200 bg-slate-50 text-slate-700";
}

function getUrgencyBadgeClass(urgency = "routine") {
  const normalizedUrgency = urgency.toLowerCase();

  if (normalizedUrgency === "urgent") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  if (normalizedUrgency === "soon") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

function getFriendlyErrorMessage(error) {
  const message = error?.message?.toLowerCase() ?? "";

  if (message.includes("imagebase64") || message.includes("imageurl")) {
    return "The selected image could not be processed. Please choose it again.";
  }

  if (message.includes("temporarily unavailable") || message.includes("rate-limited") || message.includes("quota")) {
    return "The AI analysis service is temporarily unavailable. Please try again shortly.";
  }

  if (message.includes("too large")) {
    return "The image is too large for the current AI model. Try a smaller or lower-resolution photo.";
  }

  if (message.includes("network")) {
    return "A network error interrupted the upload. Check your connection and try again.";
  }

  return "We could not analyse this image. Please try again with a clear photo in JPEG, PNG, or WebP format.";
}

function ResultCard({ result, symptomDetails }) {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-slate-800">
      <CardHeader className="space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-[#1E5EFF]">Assessment</p>
            <CardTitle className="mt-3 text-3xl font-semibold text-slate-900 dark:text-white">
              {result.condition || "No visible concern"}
            </CardTitle>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={getConfidenceBadgeClass(result.confidence)}>
              Confidence: {result.confidence || "low"}
            </Badge>
            <Badge className={getSeverityBadgeClass(result.severity)}>
              Severity: {result.severity || "none"}
            </Badge>
            <Badge className={getUrgencyBadgeClass(result.urgency)}>
              Urgency: {result.urgency || "routine"}
            </Badge>
          </div>
        </div>

        <CardDescription className="text-base leading-7 text-slate-600 dark:text-slate-300">
          {result.description || "No description was returned by the AI model."}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {symptomDetails ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              User-reported symptoms
            </h3>
            <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{symptomDetails}</p>
          </div>
        ) : null}

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Observed characteristics
          </h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
            {(result.characteristics ?? []).map((characteristic) => (
              <li key={characteristic}>{characteristic}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-[#1CB5A3]/20 bg-[#1CB5A3]/10 p-5">
          <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.2em] text-[#0f766e]">
            <ShieldCheck className="h-4 w-4" />
            Advice
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-700 dark:text-slate-200">{result.advice}</p>
        </div>

        <p className="text-sm italic leading-6 text-slate-500 dark:text-slate-400">{result.disclaimer}</p>

        {result.seek_professional ? (
          <Button
            type="button"
            className="bg-[#1E5EFF] text-white hover:bg-[#1a52e0]"
            onClick={() => window.open("https://find-a-derm.aad.org/", "_blank", "noopener,noreferrer")}
          >
            Seek Professional Help
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        ) : null}
      </CardContent>
    </Card>
  );
}

export default function SkinCheck() {
  const { user } = useAuth();
  const [errorMessage, setErrorMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [result, setResult] = useState(null);
  const [saveNotice, setSaveNotice] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [submittedSymptomDetails, setSubmittedSymptomDetails] = useState("");
  const [symptomDetails, setSymptomDetails] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0];

    if (!nextFile) {
      return;
    }

    if (!ACCEPTED_FILE_TYPES.includes(nextFile.type)) {
      setErrorMessage("Please upload a JPEG, PNG, or WebP image.");
      event.target.value = "";
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE_BYTES) {
      setErrorMessage("Please upload an image smaller than 10MB.");
      event.target.value = "";
      return;
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(nextFile);
    setPreviewUrl(URL.createObjectURL(nextFile));
    setResult(null);
    setSaveNotice("");
    setErrorMessage("");
  }

  async function handleAnalyze() {
    if (!selectedFile || !user?.id) {
      return;
    }

    if (symptomDetails.length > MAX_SYMPTOM_TEXT_LENGTH) {
      setErrorMessage(`Please keep symptom notes under ${MAX_SYMPTOM_TEXT_LENGTH} characters.`);
      return;
    }

    setIsAnalyzing(true);
    setErrorMessage("");
    setResult(null);
    setSaveNotice("");

    const trimmedSymptomDetails = symptomDetails.trim();
    let uploadedImage = null;
    let analysisCompleted = false;

    try {
      uploadedImage = await uploadSkinImage(selectedFile, user.id);

      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl: uploadedImage.publicUrl,
          symptomText: trimmedSymptomDetails,
        }),
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.message || payload.error || "Analysis failed.");
      }

      const nextResult = payload.result;
      analysisCompleted = true;
      setResult(nextResult);
      setSubmittedSymptomDetails(trimmedSymptomDetails);

      try {
        const { error } = await createSkinCheck({
          userId: user.id,
          imageUrl: uploadedImage.publicUrl,
          result: trimmedSymptomDetails
            ? { ...nextResult, user_notes: trimmedSymptomDetails }
            : nextResult,
        });

        if (error) {
          throw error;
        }

        setSaveNotice("Analysis complete. The result has been saved to your history.");
      } catch (saveError) {
        console.error("Save analysis error:", saveError);
        setSaveNotice("Analysis complete, but we could not save it to your history.");
      }
    } catch (error) {
      if (uploadedImage?.path && !analysisCompleted) {
        try {
          await deleteSkinImage(uploadedImage.path);
        } catch (cleanupError) {
          console.error("Failed to clean up uploaded image after analysis error:", cleanupError);
        }
      }

      console.error("Skin check error:", error);
      setErrorMessage(getFriendlyErrorMessage(error));
    } finally {
      setIsAnalyzing(false);
    }
  }

  function handleReset() {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl("");
    setResult(null);
    setSaveNotice("");
    setErrorMessage("");
    setSubmittedSymptomDetails("");
    setSymptomDetails("");
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 dark:bg-slate-900">
      <div className="container mx-auto max-w-5xl px-4">
        <div className="mb-8 max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#1E5EFF]">Protected scan workflow</p>
          <h1 className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">AI-assisted skin image screening</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Capture a clear skin image, submit it securely for multimodal analysis, and save the result to your private history.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 dark:text-white">Upload a skin image</CardTitle>
              <CardDescription className="text-base leading-7 text-slate-600 dark:text-slate-300">
                Use your camera on mobile or choose a file from your device, then optionally add symptom notes for true multimodal analysis. Supported formats: JPEG, PNG, WebP. Maximum size: 10MB.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <label
                htmlFor="skin-image"
                className="flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-10 text-center transition hover:border-[#1E5EFF] hover:bg-white dark:border-slate-700 dark:bg-slate-950 dark:hover:border-[#1E5EFF]"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E5EFF]/10 text-[#1E5EFF]">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <p className="mt-4 text-lg font-medium text-slate-900 dark:text-white">Choose an image or open the camera</p>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  Mobile devices can open the rear camera directly for faster capture.
                </p>
                <input
                  id="skin-image"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </label>

              {selectedFile ? (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Camera className="h-4 w-4 text-[#1E5EFF]" />
                    <span className="font-medium">{selectedFile.name}</span>
                    <span>({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)</span>
                  </div>

                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Selected skin image preview"
                      className="mt-4 h-80 w-full rounded-2xl object-cover"
                    />
                  ) : null}
                </div>
              ) : null}

              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Optional symptom notes
                  </p>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    Describe pain, itching, swelling, discharge, duration, suspected infection, or any other context you want the model to consider with the image.
                  </p>
                </div>
                <Textarea
                  value={symptomDetails}
                  onChange={(event) => setSymptomDetails(event.target.value.slice(0, MAX_SYMPTOM_TEXT_LENGTH))}
                  placeholder="Example: It has been itchy for 5 days, looks red around the edges, and started after using a new soap."
                  className="min-h-[132px] resize-y"
                />
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {symptomDetails.length}/{MAX_SYMPTOM_TEXT_LENGTH} characters
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!selectedFile || isAnalyzing}
                  className="bg-[#1E5EFF] text-white hover:bg-[#1a52e0]"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Analyse image
                </Button>
                <Button type="button" variant="outline" onClick={handleReset} disabled={isAnalyzing}>
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-slate-200 shadow-sm dark:border-slate-800">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 dark:text-white">What happens next</CardTitle>
              <CardDescription className="text-base leading-7 text-slate-600 dark:text-slate-300">
                Your image is uploaded securely to your storage bucket, its URL and optional symptom notes are sent to a protected serverless function, and the multimodal model returns a structured assessment.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-6 text-slate-600 dark:text-slate-300">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="font-semibold text-slate-900 dark:text-white">Security</p>
                <p className="mt-2">All Groq requests are routed through a serverless function so your API key never reaches the browser.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="font-semibold text-slate-900 dark:text-white">Storage</p>
                <p className="mt-2">Uploaded images are reused for both multimodal inference and saved history. If analysis fails, SkinAid now cleans up the temporary upload automatically.</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950">
                <p className="font-semibold text-slate-900 dark:text-white">Medical scope</p>
                <p className="mt-2">This remains an educational screening tool. It does not provide a diagnosis or replace clinician review.</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {errorMessage ? (
          <Alert variant="destructive" className="mt-6 border-red-200 bg-red-50 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Unable to complete analysis</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {saveNotice ? (
          <Alert className="mt-6 border-emerald-200 bg-emerald-50 text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            <AlertTitle>Analysis finished</AlertTitle>
            <AlertDescription>{saveNotice}</AlertDescription>
          </Alert>
        ) : null}

        {isAnalyzing ? <LoadingSpinner message="Analysing your skin image..." /> : null}

        {result ? <div className="mt-6"><ResultCard result={result} symptomDetails={submittedSymptomDetails} /></div> : null}

        <div className="mt-8">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}