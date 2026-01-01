import React, { useState } from "react";
import { motion } from "framer-motion";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export default function RatingWidget({ onRate, analysisId }) {
  const [rating, setRating] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleRate = async (value) => {
    setRating(value);
    if (!feedback) {
      await onRate({ rating: value, feedback: "" });
      setSubmitted(true);
    }
  };

  const handleSubmitWithFeedback = async () => {
    if (rating !== null) {
      await onRate({ rating, feedback });
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl text-center"
      >
        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
          Thank you for your feedback!
        </p>
      </motion.div>
    );
  }

  return (
    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
        Was this analysis helpful?
      </p>
      <div className="flex gap-2 mb-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRate("positive")}
          className={cn(
            "flex-1",
            rating === "positive" && "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500"
          )}
        >
          <ThumbsUp className={cn(
            "w-4 h-4 mr-2",
            rating === "positive" ? "text-emerald-600 dark:text-emerald-400" : ""
          )} />
          Helpful
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleRate("negative")}
          className={cn(
            "flex-1",
            rating === "negative" && "bg-red-50 dark:bg-red-900/20 border-red-500"
          )}
        >
          <ThumbsDown className={cn(
            "w-4 h-4 mr-2",
            rating === "negative" ? "text-red-600 dark:text-red-400" : ""
          )} />
          Not Helpful
        </Button>
      </div>
      {rating && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="space-y-2"
        >
          <Textarea
            placeholder="Optional: Tell us more about your experience..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="text-sm resize-none"
            rows={2}
          />
          <Button
            size="sm"
            onClick={handleSubmitWithFeedback}
            className="w-full bg-[#1E5EFF] hover:bg-[#1a52e0] text-white"
          >
            Submit Feedback
          </Button>
        </motion.div>
      )}
    </div>
  );
}