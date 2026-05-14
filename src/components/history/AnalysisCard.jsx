import React from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { Trash2, FileDown, User, PawPrint } from "lucide-react";
import { Button } from "@/components/ui/button";
import SeverityBadge from "@/components/ui/SeverityBadge";

export default function AnalysisCard({ analysis, onDelete, onDownload }) {
  const SubjectIcon = analysis.subject_type === "pet" ? PawPrint : User;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="md:w-48 h-48 md:h-auto bg-slate-100 dark:bg-slate-700 flex-shrink-0">
          <img
            src={analysis.image_url}
            alt="Skin check"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <SubjectIcon className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {analysis.subject_type || "Human"} Skin
                </span>
              </div>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {analysis.analysis_date 
                  ? format(new Date(analysis.analysis_date), "MMM d, yyyy 'at' h:mm a")
                  : format(new Date(analysis.created_date), "MMM d, yyyy 'at' h:mm a")
                }
              </p>
            </div>
            <SeverityBadge severity={analysis.severity} size="sm" />
          </div>

          {/* Conditions */}
          {analysis.conditions && analysis.conditions.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-slate-900 dark:text-white mb-2">
                Possible matches:
              </p>
              <div className="flex flex-wrap gap-2">
                {analysis.conditions.slice(0, 3).map((condition, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-100 dark:bg-slate-700 rounded text-xs text-slate-600 dark:text-slate-300"
                  >
                    {condition.name}
                  </span>
                ))}
                {analysis.conditions.length > 3 && (
                  <span className="px-2 py-1 text-xs text-slate-400">
                    +{analysis.conditions.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDownload(analysis)}
              className="text-xs"
            >
              <FileDown className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(analysis.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}