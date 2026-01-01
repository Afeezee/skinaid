import React from "react";
import { motion } from "framer-motion";
import { 
  Shield, 
  Heart, 
  Lock, 
  AlertCircle, 
  CheckCircle,
  XCircle,
  ArrowLeft,
  Stethoscope
} from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import Disclaimer from "@/components/ui/Disclaimer";

export default function About() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12">
          <Link 
            to={createPageUrl("Home")}
            className="inline-flex items-center text-slate-600 dark:text-slate-400 hover:text-[#1E5EFF] transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
            About SkinAid
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">
            Understanding our mission and approach to ethical AI
          </p>
        </div>

        <div className="space-y-8">
          {/* Mission */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-[#1E5EFF] to-[#1CB5A3] rounded-xl flex items-center justify-center">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Our Mission
              </h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-lg">
              SkinAid is a privacy-first, AI-assisted skin condition screening application 
              designed to help users understand possible skin abnormalities using image analysis 
              and expert-level explanations. We provide educational insights and risk awareness 
              to empower you with knowledge—not to replace professional medical care.
            </p>
          </motion.section>

          {/* What We Do / Don't Do */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  What SkinAid Does
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Analyzes visible skin features including color, texture, and patterns",
                  "Provides educational insights about possible conditions",
                  "Offers severity estimates and confidence levels",
                  "Guides you on when to seek professional care",
                  "Works for both human and pet skin concerns",
                  "Generates shareable reports for healthcare providers"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                  <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  What SkinAid Does NOT Do
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Provide medical diagnoses or clinical assessments",
                  "Prescribe medications or treatments",
                  "Replace professional medical consultations",
                  "Claim authority over medical decisions",
                  "Provide emergency medical advice",
                  "Store your data without explicit consent"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                    <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.section>
          </div>

          {/* Ethical AI */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-slate-800 dark:to-slate-800 rounded-3xl p-8 border border-blue-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center shadow-sm">
                <Shield className="w-6 h-6 text-[#1E5EFF]" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Ethical AI Principles
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: AlertCircle,
                  title: "Non-Diagnostic",
                  desc: "We clearly state that all insights are educational and never claim to provide medical diagnoses."
                },
                {
                  icon: Lock,
                  title: "Privacy-First",
                  desc: "Your images and data are processed securely. We don't sell or share your personal information."
                },
                {
                  icon: Heart,
                  title: "Transparent",
                  desc: "We openly communicate AI limitations and always recommend professional consultation for concerns."
                }
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-white dark:bg-slate-700 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                    <item.icon className="w-6 h-6 text-[#1CB5A3]" />
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{item.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Medical Responsibility */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Medical Responsibility Statement
              </h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                SkinAid is designed as an educational tool to help users become more aware of 
                their skin health. The AI analysis provides possible explanations for visible 
                skin features but should never be used as a substitute for professional medical advice.
              </p>
              <p className="leading-relaxed mt-4">
                <strong className="text-slate-900 dark:text-white">Always seek professional medical care if:</strong>
              </p>
              <ul className="mt-2 space-y-2">
                <li>Your skin condition is painful, spreading, or worsening</li>
                <li>You notice sudden changes in moles or skin lesions</li>
                <li>The condition persists for more than two weeks</li>
                <li>You experience accompanying symptoms like fever or fatigue</li>
                <li>You have concerns about any skin abnormality</li>
              </ul>
            </div>
          </motion.section>

          {/* Disclaimer */}
          <Disclaimer variant="warning" />

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center py-8"
          >
            <Link to={createPageUrl("SkinCheck")}>
              <Button
                size="lg"
                className="bg-[#1E5EFF] hover:bg-[#1a52e0] text-white px-8 py-6 text-lg rounded-xl"
              >
                Start Your Skin Check
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}