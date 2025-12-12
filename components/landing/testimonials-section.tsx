"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Budi Santoso",
    role: "Mahasiswa Ilmu Komputer",
    university: "Universitas Indonesia",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Budi",
    quote: "Campus Hub membantu saya menampilkan proyek EcoTrack ke ribuan orang. Saya mendapat feedback luar biasa dan bahkan pendanaan untuk melanjutkan pengembangan!",
  },
  {
    name: "Siti Nurhaliza",
    role: "Mahasiswa Teknik Perangkat Lunak",
    university: "Institut Teknologi Bandung",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Siti",
    quote: "Platform ini sangat memudahkan saya membagikan karya ke recruiter. Saya berhasil mendapat magang impian berkat visibilitas yang diberikan Campus Hub!",
  },
  {
    name: "Ahmad Rizki",
    role: "Mahasiswa Sistem Informasi",
    university: "Universitas Gadjah Mada",
    avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad",
    quote: "Saya suka bagaimana komunitas di sini sangat suportif. Komentar dan penjualan proyek yang saya terima memotivasi saya untuk terus membangun lebih banyak proyek!",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-zinc-900 dark:bg-black">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Cerita Sukses Mahasiswa
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Dengarkan dari mahasiswa yang telah membangun karier mereka menggunakan Campus Hub
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              <div className="bg-zinc-800 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-700 dark:border-zinc-800 hover:border-blue-500 transition-colors duration-300">
                {/* Quote Icon */}
                <div className="absolute -top-4 left-8">
                  <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                    <Quote className="w-6 h-6 text-black" />
                  </div>
                </div>

                {/* Quote */}
                <p className="text-zinc-300 mb-6 mt-4 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden bg-zinc-700">
                    <Image
                      src={testimonial.avatarUrl}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <div className="font-semibold text-white">
                      {testimonial.name}
                    </div>
                    <div className="text-sm text-zinc-400">
                      {testimonial.role}
                    </div>
                    <div className="text-xs text-blue-400">
                      {testimonial.university}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
