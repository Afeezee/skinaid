import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Lock, 
  Shield, 
  Eye, 
  Trash2, 
  Server,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
import { base44 } from "@/api/base44Client";
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

export default function Privacy() {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Delete all user's analyses
      const analyses = await base44.entities.SkinAnalysis.list("-created_date", 200);
      await Promise.all(analyses.map((a) => base44.entities.SkinAnalysis.delete(a.id)));
      // Logout after deletion
      base44.auth.logout();
    } catch (err) {
      console.error("Delete account error:", err);
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const sections = [
    {
      icon: Lock,
      title: "Data Collection",
      content: [
        "We only collect data that you explicitly provide, such as uploaded images for analysis.",
        "Account information (if you choose to create an account) is limited to essential details.",
        "We do not use cookies for tracking or advertising purposes.",
        "Usage analytics, if collected, are anonymized and aggregated."
      ]
    },
    {
      icon: Server,
      title: "Data Processing",
      content: [
        "Images are processed securely using encrypted connections.",
        "AI analysis is performed in real-time and results are delivered directly to you.",
        "We do not retain uploaded images after analysis unless you explicitly save them.",
        "All data processing complies with industry-standard security practices."
      ]
    },
    {
      icon: Eye,
      title: "Data Usage",
      content: [
        "Your data is never sold to third parties.",
        "We do not share your personal information with advertisers.",
        "Saved analyses are only accessible to you.",
        "We may use anonymized, aggregated data to improve our AI models."
      ]
    },
    {
      icon: Trash2,
      title: "Data Deletion",
      content: [
        "You can delete your saved analyses at any time.",
        "Deletion is permanent and cannot be undone.",
        "If you have an account, you can request complete data deletion.",
        "We honor all deletion requests within 30 days."
      ]
    },
    {
      icon: Shield,
      title: "Your Rights",
      content: [
        "Right to access: View all data we have about you.",
        "Right to correction: Update or correct your information.",
        "Right to deletion: Request removal of your data.",
        "Right to portability: Export your data in a standard format."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link 
            to={createPageUrl("Home")}
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Privacy & Data Policy
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            How we handle and protect your information
          </p>
        </div>

        {/* Summary Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1E5EFF] to-[#1CB5A3] rounded-3xl p-8 mb-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Our Privacy Promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "No data resale—ever",
              "Explicit consent required",
              "Your data, your control"
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <motion.section
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center">
                  <section.icon className="w-6 h-6 text-[#1E5EFF]" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  {section.title}
                </h2>
              </div>
              <ul className="space-y-3">
                {section.content.map((item, i) => (
                  <li 
                    key={i} 
                    className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
                  >
                    <span className="w-1.5 h-1.5 bg-[#1CB5A3] rounded-full mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          ))}
        </div>

        {/* Contact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 text-center"
        >
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Questions about your privacy?
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            If you have any questions or concerns about how we handle your data, 
            please reach out through our support channels.
          </p>
        </motion.div>

        {/* Last Updated */}
        <p className="text-center text-sm text-slate-400 mt-8">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}