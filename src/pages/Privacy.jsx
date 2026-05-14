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
        throw new Error("Sign in to change your account.");
      }

      const { data } = await getSession();
      const accessToken = data?.session?.access_token;

      if (!accessToken) {
        throw new Error("Your sign-in expired. Please sign in again.");
      }

      const response = await fetch("/api/account/delete", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(payload.error || "Couldn't delete the account.");
      }

      await signOut();
      setDeleteMessage("Your SkinAid account and saved data have been deleted.");
      setShowDeleteDialog(false);
      navigate(createPageUrl("Home"), { replace: true });
    } catch (err) {
      console.error("Delete account error:", err);
      setDeleteMessage("We couldn't delete your account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const sections = [
    {
      icon: Lock,
      title: "What you share",
      content: [
        "We only collect what you choose to send, like photos for a check.",
        "If you make an account, we keep only the basics needed to sign you in.",
        "We do not use cookies for ads.",
        "We may look at broad, nameless usage trends to keep the app working well."
      ]
    },
    {
      icon: Server,
      title: "How we handle it",
      content: [
        "Your photos are sent over secure connections.",
        "We process checks when you ask for them and send the result back to you.",
        "We only keep uploaded photos if you choose to save the check.",
        "We use standard safeguards to protect your data."
      ]
    },
    {
      icon: Eye,
      title: "How we use it",
      content: [
        "Your data is never sold to third parties.",
        "We do not share your details with advertisers.",
        "Saved checks are only for you.",
        "We may use nameless trend data to make the app more reliable."
      ]
    },
    {
      icon: Trash2,
      title: "Deleting your data",
      content: [
        "You can delete saved checks whenever you want.",
        "Once deleted, they are gone for good.",
        "You can delete your whole account from this page.",
        "That removes your profile, saved photos, and sign-in access."
      ]
    },
    {
      icon: Shield,
      title: "Your choices",
      content: [
        "See the data tied to your account.",
        "Fix details that are wrong or out of date.",
        "Delete your data.",
        "Ask for a copy of your data."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            Privacy
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            What we keep, what we don't, and how you stay in control
          </p>
        </div>

        {/* Summary Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#1E5EFF] to-[#1CB5A3] rounded-3xl p-8 mb-8 text-white"
        >
          <h2 className="text-2xl font-bold mb-4">Our privacy promise</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              "We do not sell your data",
              "You choose what gets saved",
              "You can delete it anytime"
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
            If something is unclear, reach out through our support channels.
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
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">Delete account</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mb-4">
                Permanently remove your SkinAid account and saved data, including your profile,
                uploaded photos, and saved checks.
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
            <AlertDialogTitle>Delete your account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove your SkinAid account, saved checks, uploaded photos,
              and profile details. This action <strong>cannot be undone</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isDeleting ? "Deleting..." : "Yes, delete it"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}