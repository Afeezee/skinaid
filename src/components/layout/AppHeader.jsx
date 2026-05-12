import React from "react";
import { Activity, ArrowLeft, LogOut, Moon, Sun } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

// Pages that are "root" pages — show logo. All others show Back button.
const ROOT_PAGES = ["Home", "SkinCheck", "History"];

export default function AppHeader({ currentPageName, isDark, onToggleTheme, user, onLogout }) {
  const navigate = useNavigate();
  const isRoot = ROOT_PAGES.includes(currentPageName);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Left: Logo or Back */}
          {isRoot ? (
            <Link
              to={createPageUrl("Home")}
              className="flex items-center gap-2 select-none"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-[#1E5EFF] to-[#1CB5A3] rounded-xl flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-slate-900 dark:text-white">SkinAid</span>
            </Link>
          ) : (
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors select-none"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
          )}

          {/* Center: Page title on sub-pages */}
          {!isRoot && (
            <span className="text-sm font-semibold text-slate-900 dark:text-white absolute left-1/2 -translate-x-1/2">
              {currentPageName}
            </span>
          )}

          {/* Right: theme + logout (desktop) */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="rounded-lg select-none"
              style={{ userSelect: "none", WebkitUserSelect: "none" }}
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-slate-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </Button>

            {user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={onLogout}
                className="hidden md:flex rounded-lg select-none"
                style={{ userSelect: "none", WebkitUserSelect: "none" }}
                title="Logout"
              >
                <LogOut className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              </Button>
            ) : (
              <Link
                to={createPageUrl("Login")}
                className="inline-flex h-9 items-center rounded-lg bg-[#1E5EFF] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#1a52e0]"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>

        {/* Desktop nav (only on root pages) */}
        {isRoot && user && (
          <nav className="hidden md:flex items-center gap-1 pb-1">
            {[
              { name: "Home", page: "Home" },
              { name: "Skin Check", page: "SkinCheck" },
              { name: "History", page: "History" },
              { name: "About", page: "About" },
              { name: "Privacy", page: "Privacy" },
            ].map((item) => (
              <Link
                key={item.page}
                to={createPageUrl(item.page)}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors select-none ${
                  currentPageName === item.page
                    ? "bg-[#1E5EFF]/10 text-[#1E5EFF]"
                    : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
                style={{ userSelect: "none", WebkitUserSelect: "none" }}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}