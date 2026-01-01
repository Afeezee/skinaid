import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Scan, RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import ImageUploader from "@/components/skincheck/ImageUploader";
import SubjectSelector from "@/components/skincheck/SubjectSelector";
import AnalysisProgress from "@/components/ui/AnalysisProgress";
import ResultsPanel from "@/components/skincheck/ResultsPanel";
import Disclaimer from "@/components/ui/Disclaimer";

export default function SkinCheck() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [subjectType, setSubjectType] = useState("human");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(null);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResults(null);
    
    // Step 1: Upload
    setCurrentStep("upload");
    await new Promise(r => setTimeout(r, 800));
    
    // Step 2: Secure
    setCurrentStep("secure");
    
    let fileUrl;
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file: selectedImage });
      fileUrl = file_url;
      setUploadedImageUrl(file_url);
    } catch (err) {
      setError("Failed to upload image. Please try again.");
      setIsAnalyzing(false);
      return;
    }
    
    await new Promise(r => setTimeout(r, 500));
    
    // Step 3: Analyze
    setCurrentStep("analyze");
    
    const subjectContext = subjectType === "pet" 
      ? "This is a pet (animal) skin image. Provide veterinary-relevant insights."
      : "This is a human skin image. Provide dermatological insights.";
    
    try {
      const analysisResult = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a skin analysis assistant providing educational insights (NOT medical diagnosis).
        
${subjectContext}

Analyze this skin image and provide:
1. Possible conditions (2-3 most likely based on visible features)
2. Visual observations about color, texture, patterns, lesions, inflammation
3. Severity estimate (low, moderate, or high)
4. Recommendations for next steps

Be calm, reassuring, and educational. Never claim to diagnose. Always recommend professional consultation for concerning findings.`,
        file_urls: [fileUrl],
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
      
      await new Promise(r => setTimeout(r, 500));
      
      // Step 4: Generate
      setCurrentStep("generate");
      await new Promise(r => setTimeout(r, 800));
      
      setResults(analysisResult);
    } catch (err) {
      setError("Analysis failed. Please try again with a clearer image.");
    }
    
    setIsAnalyzing(false);
    setCurrentStep(null);
  };

  const handleSave = async () => {
    if (!results || !uploadedImageUrl) return;
    
    setIsSaving(true);
    try {
      await base44.entities.SkinAnalysis.create({
        image_url: uploadedImageUrl,
        conditions: results.conditions,
        severity: results.severity,
        observations: results.observations,
        recommendations: results.recommendations,
        subject_type: subjectType,
        analysis_date: new Date().toISOString()
      });
      alert("Analysis saved to your history!");
    } catch (err) {
      alert("Failed to save. Please try again.");
    }
    setIsSaving(false);
  };

  const handleDownload = () => {
    if (!results) return;
    
    const report = `
SKINAID ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

IMPORTANT DISCLAIMER
This report is for educational purposes only and does not constitute medical advice, 
diagnosis, or treatment. Please consult a qualified healthcare professional for any 
skin concerns.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SUBJECT TYPE: ${subjectType === "pet" ? "Pet/Animal" : "Human"}
SEVERITY ESTIMATE: ${results.severity?.toUpperCase() || "Not determined"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

POSSIBLE CONDITIONS
${results.conditions?.map((c, i) => `
${i + 1}. ${c.name}
   ${c.description}
   Confidence: ${c.confidence ? Math.round(c.confidence * 100) + "%" : "N/A"}
`).join("") || "No conditions identified"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

VISUAL OBSERVATIONS
${results.observations?.map((o, i) => `• ${o}`).join("\n") || "No observations recorded"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

RECOMMENDED NEXT STEPS
${results.recommendations?.map((r, i) => `${i + 1}. ${r}`).join("\n") || "No recommendations"}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This report was generated by SkinAid - AI-Assisted Skin Screening Platform
For more information, visit our About page.
    `.trim();
    
    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `skinaid-report-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResults(null);
    setError(null);
    setUploadedImageUrl(null);
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
                      Upload Image
                    </label>
                    <ImageUploader
                      selectedImage={selectedImage}
                      onImageSelect={setSelectedImage}
                      onClear={() => setSelectedImage(null)}
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
                        disabled={!selectedImage || isAnalyzing}
                        className="flex-1 bg-[#1E5EFF] hover:bg-[#1a52e0] text-white py-6 text-lg rounded-xl"
                      >
                        <Scan className="w-5 h-5 mr-2" />
                        Analyze Image
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
              {results ? (
                <ResultsPanel
                  results={results}
                  onSave={handleSave}
                  onDownload={handleDownload}
                  isSaving={isSaving}
                />
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