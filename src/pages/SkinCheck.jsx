import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Scan, RefreshCw, ArrowLeft, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ImageUploader from "@/components/skincheck/ImageUploader";
import SubjectSelector from "@/components/skincheck/SubjectSelector";
import AnalysisProgress from "@/components/ui/AnalysisProgress";
import ResultsPanel from "@/components/skincheck/ResultsPanel";
import RatingWidget from "@/components/skincheck/RatingWidget";
import Disclaimer from "@/components/ui/Disclaimer";
import { Textarea } from "@/components/ui/textarea";

export default function SkinCheck() {
  const [selectedImages, setSelectedImages] = useState([]);
  const [subjectType, setSubjectType] = useState("human");
  const [additionalContext, setAdditionalContext] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedImageUrls, setUploadedImageUrls] = useState([]);
  const [savedAnalysisId, setSavedAnalysisId] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Check authentication on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await base44.auth.me();
        setIsCheckingAuth(false);
      } catch (err) {
        // Redirect to login with return to SkinCheck
        base44.auth.redirectToLogin(createPageUrl("SkinCheck"));
      }
    };
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-slate-600 dark:text-slate-400">Loading...</div>
      </div>
    );
  }

  const handleAnalyze = async () => {
    if (selectedImages.length === 0) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    
    // Step 1: Upload
    setCurrentStep("upload");
    await new Promise(r => setTimeout(r, 800));
    
    // Step 2: Secure
    setCurrentStep("secure");
    
    const fileUrls = [];
    try {
      for (const image of selectedImages) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file: image });
        fileUrls.push(file_url);
      }
      setUploadedImageUrls(fileUrls);
    } catch (err) {
      setError("Failed to upload images. Please try again.");
      setIsAnalyzing(false);
      return;
    }
    
    await new Promise(r => setTimeout(r, 500));
    
    // Step 3: Analyze
    setCurrentStep("analyze");
    
    const subjectContext = subjectType === "pet" 
      ? "This is a pet (animal) skin image. Provide veterinary-relevant insights."
      : "This is a human skin image. Provide dermatological insights.";
    
    const contextPrompt = additionalContext 
      ? `\n\nAdditional context provided by user: ${additionalContext}`
      : "";
    
    try {
      const analysisResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a skin analysis assistant providing educational insights (NOT medical diagnosis).
        
${subjectContext}${contextPrompt}

${fileUrls.length > 1 ? `You have been provided with ${fileUrls.length} images of the same subject. Analyze all images together to provide a comprehensive assessment.` : ''}

Analyze ${fileUrls.length > 1 ? 'these skin images' : 'this skin image'} and provide:
1. Possible conditions (2-3 most likely based on visible features)
2. Visual observations about color, texture, patterns, lesions, inflammation
3. Severity estimate (low, moderate, or high)
4. Recommendations for next steps

Be calm, reassuring, and educational. Never claim to diagnose. Always recommend professional consultation for concerning findings.`,
              file_urls: fileUrls,
              response_json_schema: {
          type: "object",
          properties: {
            conditions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  description: { type: "string" },
                  confidence: { type: "number" }
                }
              }
            },
            severity: { 
              type: "string",
              enum: ["low", "moderate", "high"]
            },
            observations: {
              type: "array",
              items: { type: "string" }
            },
            recommendations: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });
      
      console.log("Analysis result:", analysisResult);
      
      await new Promise(r => setTimeout(r, 500));
      
      // Step 4: Generate
      setCurrentStep("generate");
      await new Promise(r => setTimeout(r, 800));
      
      setResults(analysisResult);
      
      // Auto-save to history
      try {
        const savedAnalysis = await base44.entities.SkinAnalysis.create({
          image_url: fileUrls[0], // Save first image as primary
          conditions: analysisResult.conditions,
          severity: analysisResult.severity,
          observations: analysisResult.observations,
          recommendations: analysisResult.recommendations,
          subject_type: subjectType,
          analysis_date: new Date().toISOString(),
          user_context: additionalContext || null
        });
        setSavedAnalysisId(savedAnalysis.id);
      } catch (saveErr) {
        console.error("Failed to auto-save:", saveErr);
      }
      
      setIsAnalyzing(false);
      setCurrentStep(null);
    } catch (err) {
      console.error("Analysis error:", err);
      setError(err.message || "Analysis failed. Please try again with a clearer image.");
      setIsAnalyzing(false);
      setCurrentStep(null);
    }
  };

  const handleRate = async (ratingData) => {
    if (!savedAnalysisId) return;
    
    try {
      await base44.entities.SkinAnalysis.update(savedAnalysisId, {
        rating: ratingData.rating,
        rating_feedback: ratingData.feedback
      });
    } catch (err) {
      console.error("Failed to save rating:", err);
    }
  };

  const handleDownload = async () => {
    if (!results || uploadedImageUrls.length === 0) return;
    
    // Convert image URLs to base64
    const imagePromises = uploadedImageUrls.map(async (url) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Failed to load image:", err);
        return null;
      }
    });
    
    const base64Images = await Promise.all(imagePromises);
    
    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>SkinAid Analysis Report</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; line-height: 1.6; }
        h1 { color: #1E5EFF; border-bottom: 3px solid #1CB5A3; padding-bottom: 10px; }
        h2 { color: #333; margin-top: 30px; border-left: 4px solid #1E5EFF; padding-left: 10px; }
        .disclaimer { background: #fff3cd; border: 2px solid #ffc107; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .severity { display: inline-block; padding: 8px 15px; border-radius: 20px; font-weight: bold; }
        .severity-low { background: #d4edda; color: #155724; }
        .severity-moderate { background: #fff3cd; color: #856404; }
        .severity-high { background: #f8d7da; color: #721c24; }
        .condition { background: #f8f9fa; padding: 15px; margin: 10px 0; border-radius: 8px; border-left: 4px solid #1E5EFF; }
        .image-container { margin: 20px 0; text-align: center; }
        .image-container img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        ul { padding-left: 25px; }
        li { margin: 8px 0; }
        .metadata { color: #666; font-size: 14px; margin: 20px 0; }
    </style>
</head>
<body>
    <h1>🩺 SkinAid Analysis Report</h1>
    <p class="metadata"><strong>Generated:</strong> ${new Date().toLocaleString()}</p>
    <p class="metadata"><strong>Subject Type:</strong> ${subjectType === "pet" ? "Pet/Animal" : "Human"}</p>
    
    <div class="disclaimer">
        <strong>⚠️ IMPORTANT DISCLAIMER</strong><br>
        This report is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. 
        Please consult a qualified healthcare professional for any skin concerns.
    </div>

    ${base64Images.filter(Boolean).length > 0 ? `
    <div class="image-container">
        <h2>📸 Analyzed Image${base64Images.filter(Boolean).length > 1 ? 's' : ''}</h2>
        ${base64Images.filter(Boolean).map((base64, i) => `<img src="${base64}" alt="Skin analysis image ${i + 1}" style="margin-bottom: 10px; width: 3cm; height: auto; max-height: 3.5cm;" />`).join('')}
    </div>
    ` : ''}

    <h2>📊 Severity Assessment</h2>
    <p><span class="severity severity-${results.severity || 'low'}">${results.severity?.toUpperCase() || "NOT DETERMINED"}</span></p>

    ${additionalContext ? `
    <h2>📝 User Context</h2>
    <p>${additionalContext}</p>
    ` : ''}

    <h2>🔍 Possible Conditions</h2>
    ${results.conditions?.map((c, i) => `
        <div class="condition">
            <h3>${i + 1}. ${c.name}</h3>
            <p>${c.description}</p>
            <p><strong>Confidence:</strong> ${c.confidence ? Math.round(c.confidence * 100) + "%" : "N/A"}</p>
        </div>
    `).join("") || "<p>No conditions identified</p>"}

    <h2>👁️ Visual Observations</h2>
    <ul>
    ${results.observations?.map(o => `<li>${o}</li>`).join("") || "<li>No observations recorded</li>"}
    </ul>

    <h2>💡 Recommended Next Steps</h2>
    <ul>
    ${results.recommendations?.map(r => `<li>${r}</li>`).join("") || "<li>No recommendations</li>"}
    </ul>

    <hr style="margin: 40px 0; border: none; border-top: 2px solid #e0e0e0;">
    <p style="text-align: center; color: #666; font-size: 14px;">
        This report was generated by <strong>SkinAid</strong> - AI-Assisted Skin Screening Platform
    </p>
</body>
</html>
    `.trim();
    
    const blob = new Blob([htmlReport], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skinaid-report-${new Date().toISOString().split("T")[0]}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedImages([]);
    setResults(null);
    setError(null);
    setUploadedImageUrls([]);
    setAdditionalContext("");
    setSavedAnalysisId(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={createPageUrl("Home")}
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Skin Check
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Upload an image to receive AI-assisted educational insights
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Upload */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <AnimatePresence mode="wait">
              {isAnalyzing ? (
                <motion.div
                  key="progress"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <AnalysisProgress currentStep={currentStep} error={error} />
                </motion.div>
              ) : (
                <motion.div
                  key="upload"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Subject Selector */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      What are you checking?
                    </label>
                    <SubjectSelector value={subjectType} onChange={setSubjectType} />
                  </div>

                  {/* Image Uploader */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Upload Images
                    </label>
                    <ImageUploader
                      selectedImages={selectedImages}
                      onImagesSelect={setSelectedImages}
                      onClear={() => setSelectedImages([])}
                    />
                  </div>

                  {/* Additional Context */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
                      Additional Details (Optional)
                    </label>
                    <Textarea
                      placeholder="Add any relevant context: symptoms, duration, changes over time, etc."
                      value={additionalContext}
                      onChange={(e) => setAdditionalContext(e.target.value)}
                      className="resize-none"
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                    {results ? (
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="flex-1"
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Start New Check
                      </Button>
                    ) : (
                      <Button
                        onClick={handleAnalyze}
                        disabled={selectedImages.length === 0 || isAnalyzing}
                        className="flex-1 bg-[#1E5EFF] hover:bg-[#1a52e0] text-white py-6 text-lg rounded-xl"
                      >
                        <Scan className="w-5 h-5 mr-2" />
                        Analyze {selectedImages.length > 1 ? 'Images' : 'Image'}
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Results */}
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-700 shadow-sm">
            <AnimatePresence mode="wait">
              {error && !isAnalyzing ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mb-6">
                    <AlertCircle className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Analysis Error
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm mb-6">
                    {error}
                  </p>
                  <Button
                    onClick={() => setError(null)}
                    variant="outline"
                  >
                    Try Again
                  </Button>
                </motion.div>
              ) : results ? (
                <div className="space-y-4">
                  <ResultsPanel
                    results={results}
                    onDownload={handleDownload}
                  />
                  <RatingWidget
                    onRate={handleRate}
                    analysisId={savedAnalysisId}
                  />
                </div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col items-center justify-center text-center py-16"
                >
                  <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mb-6">
                    <Scan className="w-10 h-10 text-slate-300 dark:text-slate-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    Results will appear here
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                    Upload an image and click "Analyze" to receive AI-assisted insights about your skin
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-8">
          <Disclaimer />
        </div>
      </div>
    </div>
  );
}