"use client";

import { motion } from "framer-motion";
import { Rocket, Users, ShoppingBag, TrendingUp, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Rocket,
    title: "Tampilkan Karyamu",
    description: "Tampilkan proyekmu dengan indah lengkap dengan demo langsung dan tautan kode sumber",
  },
  {
    icon: Users,
    title: "Dapatkan Feedback",
    description: "Terima masukan berharga dari sesama mahasiswa dan profesional industri",
  },
  {
    icon: ShoppingBag,
    title: "Jual Proyekmu",
    description: "Monetisasi karya terbaikmu dengan menjual akses ke source code",
  },
  {
    icon: TrendingUp,
    title: "Bangun Portofolio",
    description: "Buat portofolio profesional yang menonjol di mata perusahaan",
  },
  {
    icon: Shield,
    title: "Pembayaran Aman",
    description: "Sistem pembayaran yang aman dan terpercaya didukung oleh Midtrans",
  },
  {
    icon: Zap,
    title: "Notifikasi Real-time",
    description: "Notifikasi instan untuk suka, komentar, dan pembelian",
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-zinc-900 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl" />
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-zinc-50 mb-4">
            Mengapa Campus Hub?
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Semua yang kamu butuhkan untuk menampilkan proyek dan terhubung dengan komunitas
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
              <div className="p-8 rounded-2xl border border-zinc-800 bg-zinc-800/50 hover:border-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
                {/* Icon */}
                <div className="w-14 h-14 rounded-xl bg-blue-900/30 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-7 h-7 text-blue-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-zinc-50 mb-3">
                  {feature.title}
                </h3>
                <p className="text-zinc-400">
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
