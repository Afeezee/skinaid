import React from "react";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Disclaimer({ variant = "default", className }) {
  const variants = {
    default: {
      bg: "bg-slate-50 dark:bg-slate-800/50",
      border: "border-slate-200 dark:border-slate-700",
      text: "text-slate-600 dark:text-slate-400",
      icon: "text-slate-400 dark:text-slate-500"
    },
    warning: {
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-200 dark:border-amber-800",
      text: "text-amber-700 dark:text-amber-400",
      icon: "text-amber-500 dark:text-amber-400"
    }
  };

  const style = variants[variant];

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl border",
        style.bg,
        style.border,
        className
      )}
    >
      <AlertCircle className={cn("w-5 h-5 flex-shrink-0 mt-0.5", style.icon)} />
      <div className={cn("text-sm leading-relaxed", style.text)}>
        <p className="font-medium mb-1">Important Notice</p>
        <p>
          This is not a medical diagnosis. SkinAid provides educational insights 
          and risk awareness only. Please consult a qualified healthcare professional 
          for any skin concerns, especially if symptoms persist or worsen.
        </p>
      </div>
    </div>
  );
}