'use client';

import { motion } from 'framer-motion';
import { FiArrowRight, FiShield, FiZap } from 'react-icons/fi';
import Link from 'next/link';

export default function CTASection() {
  return (
    <section className="section-padding relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring' as const, damping: 15, stiffness: 150 }}
          className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-8 sm:p-12 lg:p-16 overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <motion.div
              animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
              transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
              className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-[80px] translate-x-1/2 -translate-y-1/2"
            />
            <motion.div
              animate={{ x: [0, -20, 0], y: [0, 20, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
              className="absolute bottom-0 left-0 w-48 h-48 bg-accent rounded-full blur-[60px] -translate-x-1/3 translate-y-1/3"
            />
          </div>

          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring' as const, damping: 10, stiffness: 200, delay: 0.2 }}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-medium mb-4"
            >
              <FiZap className="w-3.5 h-3.5" /> Join Free Today
            </motion.div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 tracking-tight">
              Ready to Transform Your AI Experience?
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              Join thousands of creators and start crafting better prompts today. Share your prompts
              with the community and unlock premium features.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/register"
                className="btn bg-white text-primary hover:bg-white/90 rounded-xl gap-2 px-8 border-none shadow-lg shadow-black/20"
              >
                Get Started Free <FiArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/all-prompts"
                className="btn btn-ghost text-white hover:bg-white/10 rounded-xl gap-2 px-8"
              >
                Browse Prompts
              </Link>
            </div>
            <p className="text-white/60 text-xs mt-4 flex items-center justify-center gap-1">
              <FiShield className="w-3.5 h-3.5" /> No credit card required. Free plan available.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
