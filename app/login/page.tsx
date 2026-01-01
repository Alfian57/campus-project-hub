import { LoginForm } from "@/components/auth/login-form";
import { Sparkles } from "lucide-react";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Masuk",
  description:
    "Masuk ke akun Campus Project Hub Anda untuk melanjutkan ke dashboard dan mengelola proyek Anda.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-zinc-950 dark:via-zinc-900 dark:to-blue-950/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo & Title */}
        <Link href="/" className="flex items-center justify-center gap-3 mb-8">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
            Campus Hub
          </span>
        </Link>

        {/* Login Card */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
              Selamat Datang Kembali
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400">
              Masuk untuk melanjutkan ke dashboard Anda
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-6">
          © 2025 Campus Project Hub. Hak cipta dilindungi.
        </p>
      </div>
    </div>
  );
}
