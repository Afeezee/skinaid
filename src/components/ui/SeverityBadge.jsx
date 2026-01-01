import React from "react";
import { cn } from "@/lib/utils";
import { Shield, AlertTriangle, AlertCircle } from "lucide-react";

const severityConfig = {
  low: {
    label: "Low Risk",
    bgLight: "bg-emerald-50",
    bgDark: "dark:bg-emerald-900/20",
    textLight: "text-emerald-700",
    textDark: "dark:text-emerald-400",
    borderLight: "border-emerald-200",
    borderDark: "dark:border-emerald-800",
    icon: Shield
  },
  moderate: {
    label: "Moderate Risk",
    bgLight: "bg-amber-50",
    bgDark: "dark:bg-amber-900/20",
    textLight: "text-amber-700",
    textDark: "dark:text-amber-400",
    borderLight: "border-amber-200",
    borderDark: "dark:border-amber-800",
    icon: AlertTriangle
  },
  high: {
    label: "High Risk",
    bgLight: "bg-red-50",
    bgDark: "dark:bg-red-900/20",
    textLight: "text-red-700",
    textDark: "dark:text-red-400",
    borderLight: "border-red-200",
    borderDark: "dark:border-red-800",
    icon: AlertCircle
  }
};

export default function SeverityBadge({ severity, size = "md" }) {
  const config = severityConfig[severity] || severityConfig.low;
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs gap-1",
    md: "px-3 py-1.5 text-sm gap-1.5",
    lg: "px-4 py-2 text-base gap-2"
  };
  
  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5"
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        config.bgLight,
        config.bgDark,
        config.textLight,
        config.textDark,
        config.borderLight,
        config.borderDark,
        sizeClasses[size]
      )}
    >
      <Icon className={iconSizes[size]} />
      <span>{config.label}</span>
    </div>
  );
}