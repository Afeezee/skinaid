import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, History as HistoryIcon, Trash2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import AnalysisCard from "@/components/history/AnalysisCard";
import Disclaimer from "@/components/ui/Disclaimer";

export default function History() {
  const [deleteId, setDeleteId] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const queryClient = useQueryClient();

  // Check authentication on mount
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        await base44.auth.me();
        setIsCheckingAuth(false);
      } catch (err) {
        base44.auth.redirectToLogin(createPageUrl("History"));
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

  const { data: analyses, isLoading, error } = useQuery({
    queryKey: ["skin-analyses"],
    queryFn: () => base44.entities.SkinAnalysis.list("-created_date", 50),
    initialData: []
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SkinAnalysis.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["skin-analyses"] });
      setDeleteId(null);
    }
  });

  const handleDownload = (analysis) => {
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
    <p class="metadata"><strong>Generated:</strong> ${new Date(analysis.analysis_date || analysis.created_date).toLocaleString()}</p>
    <p class="metadata"><strong>Subject Type:</strong> ${analysis.subject_type === "pet" ? "Pet/Animal" : "Human"}</p>
    
    <div class="disclaimer">
        <strong>⚠️ IMPORTANT DISCLAIMER</strong><br>
        This report is for educational purposes only and does not constitute medical advice, diagnosis, or treatment. 
        Please consult a qualified healthcare professional for any skin concerns.
    </div>

    ${analysis.image_url ? `
    <div class="image-container">
        <h2>📸 Analyzed Image</h2>
        <img src="${analysis.image_url}" alt="Skin analysis image" />
    </div>
    ` : ''}

    <h2>📊 Severity Assessment</h2>
    <p><span class="severity severity-${analysis.severity || 'low'}">${analysis.severity?.toUpperCase() || "NOT DETERMINED"}</span></p>

    ${analysis.user_context ? `
    <h2>📝 User Context</h2>
    <p>${analysis.user_context}</p>
    ` : ''}

    <h2>🔍 Possible Conditions</h2>
    ${analysis.conditions?.map((c, i) => `
        <div class="condition">
            <h3>${i + 1}. ${c.name}</h3>
            <p>${c.description}</p>
            <p><strong>Confidence:</strong> ${c.confidence ? Math.round(c.confidence * 100) + "%" : "N/A"}</p>
        </div>
    `).join("") || "<p>No conditions identified</p>"}

    <h2>👁️ Visual Observations</h2>
    <ul>
    ${analysis.observations?.map(o => `<li>${o}</li>`).join("") || "<li>No observations recorded</li>"}
    </ul>

    <h2>💡 Recommended Next Steps</h2>
    <ul>
    ${analysis.recommendations?.map(r => `<li>${r}</li>`).join("") || "<li>No recommendations</li>"}
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
    a.download = `skinaid-report-${new Date(analysis.analysis_date || analysis.created_date).toISOString().split("T")[0]}.doc`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to={createPageUrl("Home")}
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Analysis History
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Your saved skin analyses
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <HistoryIcon className="w-4 h-4" />
              {analyses?.length || 0} analyses
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div 
                key={i}
                className="bg-white dark:bg-slate-800 rounded-2xl h-48 animate-pulse"
              />
            ))}
          </div>
        ) : analyses?.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-700"
          >
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HistoryIcon className="w-10 h-10 text-slate-300 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No saved analyses yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              When you save an analysis from your skin check, it will appear here
            </p>
            <Link to={createPageUrl("SkinCheck")}>
              <Button className="bg-[#1E5EFF] hover:bg-[#1a52e0] text-white">
                Start Your First Check
              </Button>
            </Link>
          </motion.div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {analyses?.map((analysis) => (
                <AnalysisCard
                  key={analysis.id}
                  analysis={analysis}
                  onDelete={setDeleteId}
                  onDownload={handleDownload}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-8">
          <Disclaimer />
        </div>

        {/* Delete Confirmation */}
        <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Analysis</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this analysis? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => deleteMutation.mutate(deleteId)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}