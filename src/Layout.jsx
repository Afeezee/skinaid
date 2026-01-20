import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Menu, 
  X, 
  Sun, 
  Moon, 
  Home, 
  Scan, 
  History, 
  Info, 
  Lock,
  Sparkles,
  LogOut
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";

const navItems = [
  { name: "Home", icon: Home, page: "Home" },
  { name: "Skin Check", icon: Scan, page: "SkinCheck" },
  { name: "History", icon: History, page: "History" },
  { name: "About", icon: Info, page: "About" },
  { name: "Privacy", icon: Lock, page: "Privacy" }
];

export default function Layout({ children, currentPageName }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem("skinaid-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }

    // Check authentication
    const checkAuth = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
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

  const handleLogin = () => {
    base44.auth.redirectToLogin(createPageUrl("SkinCheck"));
  };

  const handleLogout = () => {
    base44.auth.logout();
  };

  // Show loading state while checking auth
  if (isLoading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link 
              to={createPageUrl("Home")} 
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 bg-gradient-to-br from-[#1E5EFF] to-[#1CB5A3] rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900 dark:text-white">
                SkinAid
              </span>
            </Link>

            {/* Desktop Nav */}
            {user && (
              <nav className="hidden md:flex items-center gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPageName === item.page
                        ? "bg-[#1E5EFF]/10 text-[#1E5EFF]"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}
              </nav>
            )}

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-lg"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-slate-400" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </Button>

              {user ? (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleLogout}
                    className="hidden md:flex rounded-lg"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMenuOpen(true)}
                    className="md:hidden rounded-lg"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleLogin}
                  className="bg-[#1E5EFF] hover:bg-[#1a52e0] text-white text-sm px-4 py-2 rounded-lg"
                >
                  Sign In
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && user && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-72 bg-white dark:bg-slate-900 shadow-2xl md:hidden"
            >
              <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
                <span className="text-lg font-bold text-slate-900 dark:text-white">Menu</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMenuOpen(false)}
                  className="rounded-lg"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.page}
                    to={createPageUrl(item.page)}
                    onClick={() => setIsMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                      currentPageName === item.page
                        ? "bg-[#1E5EFF]/10 text-[#1E5EFF]"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                ))}
                <Button
                  onClick={handleLogout}
                  variant="ghost"
                  className="w-full justify-start px-4 py-3 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Button>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <Link to={createPageUrl("Home")} className="flex items-center gap-2 mb-4">
                <div className="w-9 h-9 bg-gradient-to-br from-[#1E5EFF] to-[#1CB5A3] rounded-xl flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-slate-900 dark:text-white">
                  SkinAid
                </span>
              </Link>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-sm">
                AI-assisted skin screening for awareness and early insight. 
                Privacy-first, ethical AI that empowers you with knowledge.
              </p>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2">
                {navItems.slice(0, 3).map((item) => (
                  <li key={item.page}>
                    <Link
                      to={createPageUrl(item.page)}
                      className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link
                    to={createPageUrl("About")}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    to={createPageUrl("Privacy")}
                    className="text-sm text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © {new Date().getFullYear()} SkinAid.
              </p>
              <a 
                href="https://cereustechnologies.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm font-semibold bg-gradient-to-r from-[#1E5EFF] to-[#1CB5A3] bg-clip-text text-transparent hover:opacity-80 transition-opacity"
              >
                By Cereus Technologies
              </a>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center md:text-right">
              Not a medical device. Does not provide diagnoses, treatment recommendations, or prescriptions.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}