"use client";

import { motion } from "framer-motion";
import { Rocket, Users, Heart, TrendingUp, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Showcase Your Work",
    description: "Display your projects beautifully with live demos and source code links",
  },
  {
    icon: Users,
    title: "Get Feedback",
    description: "Receive valuable feedback and reviews from peers and recruiters",
  },
  {
    icon: Heart,
    title: "Earn Support",
    description: "Get financial support from people who appreciate your work",
  },
  {
    icon: TrendingUp,
    title: "Build Your Portfolio",
    description: "Create a professional portfolio that stands out to employers",
  },
  {
    icon: Shield,
    title: "Secure Payments",
    description: "Safe and secure donation system powered by Midtrans",
  },
  {
    icon: Zap,
    title: "Real-time Updates",
    description: "Instant notifications for likes, comments, and donations",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-white dark:bg-zinc-900">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-zinc-50 mb-4">
            Why Choose Campus Hub?
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            Everything you need to showcase your projects and connect with the community
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/50 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300 hover:shadow-lg">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
