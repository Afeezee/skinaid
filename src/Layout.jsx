import React, { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

import LoadingSpinner from "@/components/LoadingSpinner";
import AppHeader from "@/components/layout/AppHeader";
import BottomNav from "@/components/layout/BottomNav";
import { useAuth } from "@/lib/auth";
import { createPageUrl } from "@/utils";

const ROOT_PAGES = ["Home", "SkinCheck", "History"];

export default function Layout({ children, currentPageName }) {
  const [isDark, setIsDark] = useState(false);
  const { loading, signOut, user } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem("skinaid-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(!isDark);
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("skinaid-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("skinaid-theme", "dark");
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return <LoadingSpinner fullScreen message="Loading SkinAid..." />;
  }

  const isRoot = ROOT_PAGES.includes(currentPageName);
  // header is taller on desktop (has nav row) for root pages
  const headerHeight = isRoot ? "pt-[calc(3.5rem+2rem)]" : "pt-14";

  return (
    <div
      className="min-h-screen bg-white dark:bg-slate-900 transition-colors"
      style={{ overscrollBehavior: "none" }}
    >
      <style>{`
        * { -webkit-tap-highlight-color: transparent; }
        button, a, [role="button"] { user-select: none; -webkit-user-select: none; }
      `}</style>

      <AppHeader
        currentPageName={currentPageName}
        isDark={isDark}
        onToggleTheme={toggleTheme}
        user={user}
        onLogout={handleLogout}
      />

      {/* Main Content — extra bottom padding on mobile for bottom nav */}
      <main className={`${headerHeight} pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0`}>
        {children}
      </main>

      {/* Bottom Nav — mobile only */}
      {user && <BottomNav currentPageName={currentPageName} />}

      {/* Footer — hidden on mobile (bottom nav takes over) */}
      <footer className="hidden md:block bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <Link to={createPageUrl("Home")} className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-[#1E5EFF] to-[#1CB5A3] rounded-xl flex items-center justify-center">
                  <Activity className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">SkinAid</span>
              </Link>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm">
                Quick skin checks for everyday peace of mind.
                Private by design and clear about limits.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {["Home", "SkinCheck", "History"].map((page) => (
                  <li key={page}>
                    <Link to={createPageUrl(page)} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors">
                      {page === "SkinCheck" ? "Skin Check" : page}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><Link to={createPageUrl("About")} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors">About Us</Link></li>
                <li><Link to={createPageUrl("Privacy")} className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} SkinAid.</p>
              <a href="https://cereustechnologies.com" target="_blank" rel="noopener noreferrer"
                className="text-sm font-semibold bg-gradient-to-r from-[#1E5EFF] to-[#1CB5A3] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                By Cereus Technologies
              </a>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center md:text-right">
              Guide only. No diagnosis, treatment plans, or prescriptions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}