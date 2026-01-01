import React from "react";
import { motion } from "framer-motion";
import { User, PawPrint } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SubjectSelector({ value, onChange }) {
  const options = [
    { id: "human", label: "Human", icon: User },
    { id: "pet", label: "Pet", icon: PawPrint }
  ];

  return (
    <div className="flex gap-3">
      {options.map((option) => {
        const isSelected = value === option.id;
        const Icon = option.icon;
        
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 transition-all duration-200",
              isSelected
                ? "border-[#1E5EFF] bg-[#1E5EFF]/5 text-[#1E5EFF]"
                : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600"
            )}
          >
            {isSelected && (
              <motion.div
                layoutId="subject-indicator"
                className="absolute inset-0 bg-[#1E5EFF]/5 rounded-xl"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <Icon className={cn(
              "w-5 h-5 relative z-10",
              isSelected ? "text-[#1E5EFF]" : ""
            )} />
            <span className={cn(
              "font-medium relative z-10",
              isSelected ? "text-[#1E5EFF]" : ""
            )}>
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}