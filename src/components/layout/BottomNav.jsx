import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Home, Scan, History } from "lucide-react";

const tabs = [
  { name: "Home", icon: Home, page: "Home" },
  { name: "Skin Check", icon: Scan, page: "SkinCheck" },
  { name: "History", icon: History, page: "History" },
];

export default function BottomNav({ currentPageName }) {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const isActive = currentPageName === tab.page;
          return (
            <Link
              key={tab.page}
              to={createPageUrl(tab.page)}
              className="flex-1 flex flex-col items-center justify-center py-2 gap-1 transition-colors select-none"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              <tab.icon
                className={`w-5 h-5 transition-colors ${
                  isActive ? "text-[#1E5EFF]" : "text-slate-400 dark:text-slate-500"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? "text-[#1E5EFF]" : "text-slate-400 dark:text-slate-500"
                }`}
              >
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}