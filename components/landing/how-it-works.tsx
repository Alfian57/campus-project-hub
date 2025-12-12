"use client";

import { motion } from "framer-motion";
import { Upload, MessageSquare, DollarSign } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Unggah Proyekmu",
    description: "Bagikan proyek inovatifmu dengan thumbnail menarik, deskripsi lengkap, dan tautan ke demo serta kode sumber",
  },
  {
    number: "02",
    icon: MessageSquare,
    title: "Dapatkan Feedback",
    description: "Terima masukan konstruktif dari sesama mahasiswa, mentor, dan calon employer melalui komentar dan diskusi",
  },
  {
    number: "03",
    icon: DollarSign,
    title: "Raih Dukungan",
    description: "Dapatkan dukungan finansial dari orang-orang yang mengapresiasi karyamu melalui sistem donasi yang aman",
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-gradient-to-br from-zinc-950 via-blue-950/20 to-cyan-950/10 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Cara Kerja
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Tiga langkah sederhana untuk menampilkan karyamu dan mendapatkan pengakuan
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
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-xl shadow-blue-500/20">
                    <step.icon className="w-16 h-16 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center border-4 border-blue-500 shadow-lg">
                    <span className="text-2xl font-bold text-zinc-50">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-zinc-50 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-lg text-zinc-400">
                    {step.description}
                  </p>
                </div>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute left-16 top-32 w-0.5 h-16 bg-gradient-to-b from-blue-500 to-blue-900" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
