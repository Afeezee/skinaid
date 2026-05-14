import React from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  AlertCircle, 
  Lightbulb, 
  Stethoscope,
  ChevronRight,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SeverityBadge from "@/components/ui/SeverityBadge";
import Disclaimer from "@/components/ui/Disclaimer";

export default function ResultsPanel({ results, onDownload }) {
  if (!results) return null;

  const { conditions, severity, observations, recommendations } = results;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Your results
        </h2>
        <SeverityBadge severity={severity} size="lg" />
      </div>

      {/* Disclaimer */}
      <Disclaimer variant="warning" />

      {/* Conditions */}
      {conditions && conditions.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Eye className="w-5 h-5 text-[#1E5EFF]" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              What it could be
            </h3>
          </div>
          <div className="space-y-4">
            {conditions.map((condition, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-slate-900 dark:text-white">
                    {condition.name}
                  </h4>
                  {condition.confidence && (
                    <span className="text-xs text-slate-500 dark:text-slate-400 px-2 py-1 bg-slate-200/50 dark:bg-slate-600/50 rounded">
                      {Math.round(condition.confidence * 100)}% match
                    </span>
                  )}
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {condition.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Observations */}
      {observations && observations.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="w-5 h-5 text-[#1CB5A3]" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              What we noticed
            </h3>
          </div>
          <ul className="space-y-2">
            {observations.map((obs, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3 text-slate-600 dark:text-slate-400"
              >
                <ChevronRight className="w-4 h-4 text-[#1CB5A3] mt-1 flex-shrink-0" />
                <span>{obs}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 rounded-2xl p-6 border border-blue-200 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <Stethoscope className="w-5 h-5 text-[#1E5EFF]" />
            <h3 className="font-semibold text-slate-900 dark:text-white">
              What to do next
            </h3>
          </div>
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="flex items-start gap-3"
              >
                <span className="w-6 h-6 bg-[#1E5EFF]/10 text-[#1E5EFF] rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {index + 1}
                </span>
                <span className="text-slate-700 dark:text-slate-300">{rec}</span>
              </motion.li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-4">
        <Button
          onClick={onDownload}
          variant="outline"
          className="flex-1"
        >
          <Download className="w-4 h-4 mr-2" />
          Download summary
        </Button>
      </div>
    </motion.div>
  );
}