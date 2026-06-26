'use client';

import Link from 'next/link';
import { FiGithub, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-base-200/50 border-t border-base-300/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">PV</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                PromptVerse
              </span>
            </Link>
            <p className="text-base-content/55 text-sm max-w-md leading-relaxed">
              The ultimate AI prompt marketplace. Discover, create, and share high-quality prompts for
              ChatGPT, Gemini, Claude, Midjourney, and more.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-square rounded-xl" aria-label="X (Twitter)">
                <FaXTwitter className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-square rounded-xl" aria-label="GitHub">
                <FiGithub className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm btn-square rounded-xl" aria-label="LinkedIn">
                <FiLinkedin className="w-4 h-4" />
              </a>
              <a href="mailto:hello@promptverse.com" className="btn btn-ghost btn-sm btn-square rounded-xl" aria-label="Email">
                <FiMail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              <li><Link href="/all-prompts" className="text-sm text-base-content/55 hover:text-primary transition-colors duration-200">All Prompts</Link></li>
              <li><Link href="/login" className="text-sm text-base-content/55 hover:text-primary transition-colors duration-200">Login</Link></li>
              <li><Link href="/register" className="text-sm text-base-content/55 hover:text-primary transition-colors duration-200">Register</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4">Support</h3>
            <ul className="space-y-2.5">
              <li><a href="mailto:help@promptverse.com" className="text-sm text-base-content/55 hover:text-primary transition-colors duration-200">Contact Us</a></li>
              <li><a href="#" className="text-sm text-base-content/55 hover:text-primary transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="text-sm text-base-content/55 hover:text-primary transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-base-300/50 mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-base-content/40">
            &copy; {currentYear} PromptVerse. All rights reserved.
          </p>
          <p className="text-sm text-base-content/40 flex items-center gap-1">
            Made with <FiHeart className="w-3.5 h-3.5 text-error" /> by PromptVerse Team
          </p>
        </div>
      </div>
    </footer>
  );
}
