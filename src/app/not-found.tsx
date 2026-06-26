'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiHome, FiArrowLeft, FiSearch, FiGrid, FiStar, FiUser } from 'react-icons/fi';

const suggestions = [
  { href: '/all-prompts', icon: FiGrid, label: 'Browse Prompts' },
  { href: '/login', icon: FiUser, label: 'Sign In' },
];

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center px-4 max-w-lg"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, delay: 0.1 }}
          className="w-24 h-24 rounded-3xl bg-base-200 flex items-center justify-center mx-auto mb-6"
        >
          <FiSearch className="w-10 h-10 text-base-content/30" />
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-7xl font-bold text-base-content/10 mb-2"
        >
          404
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2"
        >
          Page Not Found
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-base-content/60 mb-8"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Check the URL or head back to a known page.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-center gap-3 mb-6"
        >
          <button onClick={() => window.history.back()} className="btn btn-outline rounded-xl gap-2">
            <FiArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link href="/" className="btn btn-primary rounded-xl gap-2">
            <FiHome className="w-4 h-4" /> Home
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-2"
        >
          {suggestions.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              href={href}
              className="btn btn-ghost btn-sm rounded-lg gap-1.5 text-base-content/60"
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
