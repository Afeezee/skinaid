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
            What SkinAid is for and how we keep it simple
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
              SkinAid helps you make sense of skin changes from a photo. It gives you a simple
              read on what might be going on and whether it may be worth getting checked. It is
              here to inform you, not replace a doctor or vet.
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
                  What SkinAid does
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Looks at visible changes in a photo",
                  "Gives a simple read on what it might be",
                  "Shows how serious it may look",
                  "Helps you decide when to get it checked",
                  "Works for people and pets",
                  "Creates a report you can share"
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
                  What it won't do
                </h3>
              </div>
              <ul className="space-y-3">
                {[
                  "Give a diagnosis",
                  "Prescribe medicine or treatment",
                  "Replace a doctor or vet",
                  "Make urgent care decisions for you",
                  "Help in an emergency",
                  "Keep data you did not choose to save"
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
                How we keep it fair
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: AlertCircle,
                  title: "Clear limits",
                  desc: "We say upfront that this is guidance only, not a diagnosis."
                },
                {
                  icon: Lock,
                  title: "Private first",
                  desc: "Your photos and details stay protected. We do not sell your data."
                },
                {
                  icon: Heart,
                  title: "Plain and honest",
                  desc: "We keep the wording simple and tell you when it is time to see a professional."
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
                When to get medical help
              </h2>
            </div>
            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400">
              <p className="leading-relaxed">
                SkinAid is a simple guide to help you notice what may need attention. If
                something hurts, changes fast, or worries you, talk to a doctor or vet.
              </p>
              <p className="leading-relaxed mt-4">
                <strong className="text-slate-900 dark:text-white">Get medical help if:</strong>
              </p>
              <ul className="mt-2 space-y-2">
                <li>It hurts, spreads, or gets worse</li>
                <li>A mole or spot changes quickly</li>
                <li>It lasts more than two weeks</li>
                <li>You also feel unwell</li>
                <li>Something just does not look right</li>
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
                Start a Check
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}