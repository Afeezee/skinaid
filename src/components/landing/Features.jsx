import React from "react";
import { motion } from "framer-motion";
import { 
  Eye, 
  Brain, 
  FileDown, 
  History, 
  PawPrint, 
  ShieldCheck 
} from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Photo Check",
    description: "Looks for things that stand out in the photo, like color, texture, and spread."
  },
  {
    icon: Brain,
    title: "Easy-to-read Results",
    description: "Gives you a simple summary, how serious it may look, and what to do next."
  },
  {
    icon: FileDown,
    title: "Shareable Summary",
    description: "Save a clean report to show a doctor or vet."
  },
  {
    icon: History,
    title: "Past Checks",
    description: "Keep earlier checks in one place if you want to look back."
  },
  {
    icon: PawPrint,
    title: "People and Pets",
    description: "Use it for your skin or your pet's skin."
  },
  {
    icon: ShieldCheck,
    title: "Built with care",
    description: "Clear limits, no treatment claims, and honest guidance."
  }
];

export default function Features() {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-800/50">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            Simple help, less stress
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Useful tools without the hard-to-read medical talk
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="group p-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-[#1E5EFF] to-[#1CB5A3] rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}