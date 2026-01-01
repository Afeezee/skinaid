import React from "react";
import { motion } from "framer-motion";
import { Upload, Scan, FileCheck, Stethoscope } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Image",
    description: "Take a clear photo of the skin area you'd like to check and upload it securely."
  },
  {
    icon: Scan,
    title: "AI Analysis",
    description: "Our AI examines colour, texture, and patterns to identify potential concerns."
  },
  {
    icon: FileCheck,
    title: "Get Insights",
    description: "Receive educational information about possible conditions and severity."
  },
  {
    icon: Stethoscope,
    title: "Seek Care",
    description: "Use insights to decide if you should consult a healthcare professional."
  }
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            How SkinAid Works
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            A simple, private process to help you understand your skin better
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-[60%] w-full h-px bg-gradient-to-r from-slate-200 to-transparent dark:from-slate-700" />
              )}

              <div className="flex flex-col items-center text-center">
                {/* Step number */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-[#1E5EFF]/10 to-[#1CB5A3]/10 rounded-2xl flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-[#1E5EFF]" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-7 h-7 bg-[#1CB5A3] text-white text-sm font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}