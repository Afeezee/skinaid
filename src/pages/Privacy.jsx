import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  Lock, 
  Shield, 
  Eye, 
  Trash2, 
  Server,
  CheckCircle,
  AlertTriangle
} from "lucide-react";
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
import { getSession, signOut, useAuth } from "@/lib/auth";
import { createPageUrl } from "@/utils";

export default function Privacy() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    setDeleteMessage("");

    try {
      if (!user?.id) {
        throw new Error("Sign in to manage your account.");
      }

      const { data } = await getSession();
      const accessToken = data?.session?.access_token;

      if (!accessToken) {
        throw new Error("Your session has expired. Please sign in again.");
      }

      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Account deletion failed.");
      }

      await signOut();
      setDeleteMessage("Your SkinAid account and all saved data have been deleted.");
      setShowDeleteDialog(false);
      navigate(createPageUrl("Home"), { replace: true });
    } catch (err) {
      console.error("Delete account error:", err);
      setDeleteMessage("We could not delete your account. Please try again.");
    } finally {
      setIsDeleting(false);
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
        "We may use anonymized, aggregated operational data to improve reliability and product quality."
      ]
    },
    {
      icon: Trash2,
      title: "Data Deletion",
      content: [
        "You can delete individual saved analyses at any time.",
        "Deletion is permanent and cannot be undone.",
        "You can also delete your full account directly from this page.",
        "Full account deletion removes profile data, uploaded scan images, and authentication access."
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

        {/* Delete Account */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-3xl p-8"
        >
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Delete Account</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Permanently delete your SkinAid account and associated data, including your profile,
                uploaded scan images, and saved analysis history.
              </p>
              <Button
                variant="destructive"
                onClick={() => setShowDeleteDialog(true)}
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={!user}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete My Account
              </Button>
              {deleteMessage ? (
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">{deleteMessage}</p>
              ) : null}
            </div>
          </div>
        </motion.div>

        {/* Last Updated */}
        <p className="text-center text-sm text-slate-400 mt-8 mb-4">
          Last updated: {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Delete Account Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete your SkinAid account, saved scan history, uploaded images,
              and profile data.
              This action <strong>cannot be undone</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Yes, delete my account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}