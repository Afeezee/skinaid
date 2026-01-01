import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Lock, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
      
      {/* Subtle pattern */}
      <div className="absolute inset-0 opacity-30 dark:opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-[#1E5EFF]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-[#1CB5A3]/10 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Trust badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-slate-200 dark:border-slate-700 mb-8">
              <Shield className="w-4 h-4 text-[#1CB5A3]" />
              <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                Privacy-First • Ethical AI • Non-Diagnostic
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
              Understand your skin.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E5EFF] to-[#1CB5A3]">
                Know when to seek help.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              AI-assisted skin screening for awareness and early insight. 
              Get educational insights about your skin in minutes, privately and securely.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={createPageUrl("SkinCheck")}>
                <Button
                  size="lg"
                  className="bg-[#1E5EFF] hover:bg-[#1a52e0] text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:shadow-xl hover:shadow-blue-500/30"
                >
                  Start Skin Check
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link to={createPageUrl("About")}>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-xl border-slate-300 dark:border-slate-600"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
          >
            {[
              { icon: Shield, title: "Non-Diagnostic", desc: "Educational insights, not medical advice" },
              { icon: Lock, title: "Privacy-First", desc: "Your data stays yours, always" },
              { icon: Heart, title: "Ethical AI", desc: "Responsible and transparent" }
            ].map((item, i) => (
              <div
                key={i}
                className="flex flex-col items-center p-6 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-slate-200/50 dark:border-slate-700/50"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-[#1E5EFF]/10 to-[#1CB5A3]/10 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-[#1E5EFF]" />
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{item.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}