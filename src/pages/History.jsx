import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { AlertCircle, History as HistoryIcon, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Disclaimer from "@/components/ui/Disclaimer";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { deleteSkinCheck, getUserSkinChecks } from "@/lib/db";
import { createPageUrl } from "@/utils";

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

export default function History() {
  const { user } = useAuth();
  const [checks, setChecks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [checkToDelete, setCheckToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadHistory() {
      if (!user?.id) {
        return;
      }

      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await getUserSkinChecks(user.id);
      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("History fetch error:", error);
        setChecks([]);
        setErrorMessage("We could not load your saved scans. Please try again.");
      } else {
        setChecks(data ?? []);
      }

      setIsLoading(false);
    }

    loadHistory();

    return () => {
      isMounted = false;
    };
  }, [user?.id]);

  async function handleDelete() {
    if (!checkToDelete) {
      return;
    }

    setIsDeleting(true);
    const { error } = await deleteSkinCheck(checkToDelete.id);

    if (error) {
      console.error("Delete history error:", error);
      setErrorMessage("We could not delete that scan. Please try again.");
    } else {
      setChecks((currentChecks) => currentChecks.filter((check) => check.id !== checkToDelete.id));
    }

    setIsDeleting(false);
    setCheckToDelete(null);
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                Analysis History
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                Review and manage your previous SkinAid scans
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500">
              <HistoryIcon className="w-4 h-4" />
              {checks.length} saved scans
            </div>
          </div>
        </div>

        {errorMessage ? (
          <Alert variant="destructive" className="mb-6 border-red-200 bg-red-50 text-red-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>History unavailable</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden rounded-3xl border-slate-200 dark:border-slate-800">
                <CardContent className="grid gap-4 p-0 md:grid-cols-[180px_1fr]">
                  <Skeleton className="h-44 w-full rounded-none" />
                  <div className="space-y-4 p-6">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-10 w-28" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : checks.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center dark:border-slate-800 dark:bg-slate-900">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <HistoryIcon className="w-10 h-10 text-slate-300 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
              No saved scans yet
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm mx-auto">
              Complete your first AI-assisted skin check and it will appear here automatically.
            </p>
            <Link to={createPageUrl("SkinCheck")}>
              <Button className="bg-[#1E5EFF] hover:bg-[#1a52e0] text-white">
                Start a skin check
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {checks.map((check) => (
              <Card
                key={check.id}
                className="overflow-hidden rounded-3xl border-slate-200 shadow-sm dark:border-slate-800"
              >
                <CardContent className="grid gap-0 p-0 md:grid-cols-[180px_1fr]">
                  <div className="h-48 bg-slate-100 dark:bg-slate-800 md:h-full">
                    {check.image_url ? (
                      <img
                        src={check.image_url}
                        alt={check.result?.condition || "Saved skin scan"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-sm text-slate-500 dark:text-slate-400">
                        No image available
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col justify-between gap-5 p-6">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#1E5EFF]">
                            Saved result
                          </p>
                          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
                            {check.result?.condition || "Assessment saved"}
                          </h2>
                        </div>
                        <Badge className={getSeverityBadgeClass(check.result?.severity)}>
                          {(check.result?.severity || "none").replace(/^[a-z]/, (letter) => letter.toUpperCase())}
                        </Badge>
                      </div>

                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        {format(new Date(check.created_at), "MMM d, yyyy 'at' h:mm a")}
                      </p>

                      <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">
                        {check.result?.description || "A saved AI-assisted assessment for later reference."}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="border-slate-200 bg-slate-50 text-slate-700">
                          Confidence: {check.result?.confidence || "unknown"}
                        </Badge>
                        <Badge className="border-slate-200 bg-slate-50 text-slate-700">
                          Urgency: {check.result?.urgency || "routine"}
                        </Badge>
                      </div>

                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => setCheckToDelete(check)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-8">
          <Disclaimer />
        </div>

        <AlertDialog open={Boolean(checkToDelete)} onOpenChange={(open) => !open && setCheckToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete saved scan</AlertDialogTitle>
              <AlertDialogDescription>
                This removes the saved history entry from your account. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}