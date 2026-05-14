import React from "react";
import { motion } from "framer-motion";
import { Check, Upload, Lock, Scan, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  { id: "upload", label: "Photo added", icon: Upload },
  { id: "secure", label: "Kept private", icon: Lock },
  { id: "analyze", label: "Checking photo", icon: Scan },
  { id: "generate", label: "Writing your result", icon: FileText }
];

export default function AnalysisProgress({ currentStep, error }) {
  const currentIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="w-full max-w-md mx-auto py-8">
      <div className="space-y-4">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isPending = index > currentIndex;

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4"
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                  isCompleted && "bg-emerald-500 text-white",
                  isCurrent && "bg-[#1E5EFF] text-white",
                  isPending && "bg-slate-100 dark:bg-slate-800 text-slate-400"
                )}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : isCurrent ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <Icon className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1">
                <p
                  className={cn(
                    "font-medium transition-colors",
                    isCompleted && "text-emerald-600 dark:text-emerald-400",
                    isCurrent && "text-[#1E5EFF] dark:text-blue-400",
                    isPending && "text-slate-400 dark:text-slate-500"
                  )}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <motion.div
                    className="h-1 bg-slate-100 dark:bg-slate-700 rounded-full mt-2 overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-[#1E5EFF] rounded-full"
                      animate={{ width: ["0%", "100%"] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
      
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}
    </div>
  );
}