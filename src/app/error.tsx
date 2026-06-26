'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw, FiHome, FiWifiOff, FiSend } from 'react-icons/fi';
import Link from 'next/link';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    console.error(error);
    setIsOnline(typeof navigator !== 'undefined' ? navigator.onLine : true);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [error]);

  const isOffline = !isOnline;

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
          className={`w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-6 ${
            isOffline ? 'bg-warning/10' : 'bg-error/10'
          }`}
        >
          {isOffline ? (
            <FiWifiOff className="w-10 h-10 text-warning" />
          ) : (
            <FiAlertTriangle className="w-10 h-10 text-error" />
          )}
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold mb-2"
        >
          {isOffline ? 'No Internet Connection' : 'Something Went Wrong'}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="text-base-content/60 mb-8"
        >
          {isOffline
            ? 'You appear to be offline. Check your network connection and try again.'
            : 'An unexpected error occurred. Please try again or contact support if the problem persists.'}
        </motion.p>
        {error.digest && !isOffline && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-xs text-base-content/30 mb-6 font-mono"
          >
            Error ID: {error.digest}
          </motion.p>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="flex items-center justify-center gap-3 flex-wrap"
        >
          <button onClick={reset} className="btn btn-primary rounded-xl gap-2">
            <FiRefreshCw className="w-4 h-4" /> Try Again
          </button>
          {isOffline && (
            <button onClick={() => window.location.reload()} className="btn btn-primary rounded-xl gap-2">
              <FiRefreshCw className="w-4 h-4" /> Reload
            </button>
          )}
          <Link href="/" className="btn btn-outline rounded-xl gap-2">
            <FiHome className="w-4 h-4" /> Go Home
          </Link>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-xs text-base-content/30 mt-6"
        >
          Need help?{' '}
          <a href="mailto:support@promptverse.com?subject=Error Report" className="underline hover:text-base-content/50">
            Contact support
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
}
