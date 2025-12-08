"use client";

import { motion } from "framer-motion";
import { Upload, MessageSquare, DollarSign } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Your Project",
    description: "Share your innovative projects with beautiful thumbnails, descriptions, and links to demos and source code",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Get Feedback",
    description: "Receive constructive feedback from peers, mentors, and potential employers through comments and discussions",
  },
  {
    number: "03",
    icon: DollarSign,
    title: "Earn Support",
    description: "Get financial support from people who appreciate your work through our secure donation system",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/10 dark:to-cyan-950/10">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Three simple steps to showcase your work and get recognized
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative mb-16 last:mb-0"
            >
              <div className="flex flex-col md:flex-row items-center gap-8">
                {/* Number & Icon */}
                <div className="flex-shrink-0 relative">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-xl">
                    <step.icon className="w-16 h-16 text-black" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-lg">
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-lg text-zinc-600 dark:text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-16 top-32 w-0.5 h-16 bg-gradient-to-b from-blue-500 to-blue-200 dark:to-blue-800" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
