import React from "react";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, Lock, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import Disclaimer from "@/components/ui/Disclaimer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Hero />
      <HowItWorks />
      <Features />
      
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-[#1E5EFF] to-[#1CB5A3]">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready for a quick skin check?
            </h2>
            <p className="text-xl text-white/80 mb-10">
              Get a clear read in minutes. Private, simple, and easy to use.
            </p>
            <Link to={createPageUrl("SkinCheck")}>
              <Button
                size="lg"
                className="bg-white text-[#1E5EFF] hover:bg-white/90 px-8 py-6 text-lg rounded-xl shadow-lg"
              >
                Start Free Check
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className="py-12 bg-slate-50 dark:bg-slate-900">
        <div className="container mx-auto px-6">
          <div className="max-w-3xl mx-auto">
            <Disclaimer />
          </div>
        </div>
      </section>
    </div>
  );
}