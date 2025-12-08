import Link from "next/link";
import { Sparkles, Github, Twitter, Linkedin, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-zinc-900 dark:bg-black border-t border-zinc-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-black" />
              </div>
              <span className="text-xl font-bold text-white">
                Campus Hub
              </span>
            </div>
            <p className="text-zinc-400 text-sm mb-4">
              Empowering students to showcase their creativity and get recognized for their work.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
              >
                <Github className="w-4 h-4 text-zinc-400" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4 text-zinc-400" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4 text-zinc-400" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-zinc-400 hover:text-blue-400 transition-colors text-sm">
                  Explore Projects
                </Link>
              </li>
              <li>
                <Link href="/register" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Upload Project
                </Link>
              </li>
              <li>
                <a href="#features" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Features
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  How It Works
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Careers
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/guidelines" className="text-zinc-400 hover:text-lime-400 transition-colors text-sm">
                  Community Guidelines
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-zinc-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              © 2025 Campus Project Hub. Built with Next.js 14 & Midtrans.
            </p>
            <div className="flex items-center gap-6">
              <a
                href="mailto:support@campushub.com"
                className="text-sm text-zinc-400 hover:text-lime-400 transition-colors flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                support@campushub.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
