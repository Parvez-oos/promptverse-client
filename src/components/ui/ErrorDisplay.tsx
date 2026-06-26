'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiAlertTriangle, FiRefreshCw, FiHome, FiWifiOff, FiServer, FiSend } from 'react-icons/fi';
import Link from 'next/link';

interface ErrorDisplayProps {
  message?: string;
  onRetry?: () => void;
  fullPage?: boolean;
  showReport?: boolean;
}

function getNetworkStatus() {
  return typeof navigator !== 'undefined' ? navigator.onLine : true;
}

export default function ErrorDisplay({ message, onRetry, fullPage, showReport }: ErrorDisplayProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(getNetworkStatus());
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const isOffline = !isOnline;
  const displayMessage = message
    ? message
    : isOffline
      ? 'No internet connection. Please check your network.'
      : 'Something went wrong.';

  const content = (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 ${
          isOffline ? 'bg-warning/10' : 'bg-error/10'
        }`}
      >
        {isOffline ? (
          <FiWifiOff className="w-7 h-7 text-warning" />
        ) : (
          <FiAlertTriangle className="w-7 h-7 text-error" />
        )}
      </motion.div>
      <h3 className="text-lg font-semibold text-base-content/70 mb-1">
        {isOffline ? 'No Connection' : 'Error'}
      </h3>
      <p className="text-sm text-base-content/40 max-w-sm mb-6">{displayMessage}</p>
      <div className="flex items-center gap-3">
        {onRetry && (
          <button onClick={onRetry} className="btn btn-primary btn-sm rounded-lg gap-1.5">
            <FiRefreshCw className="w-3.5 h-3.5" /> Try Again
          </button>
        )}
        {isOffline && (
          <button onClick={() => window.location.reload()} className="btn btn-primary btn-sm rounded-lg gap-1.5">
            <FiRefreshCw className="w-3.5 h-3.5" /> Reload
          </button>
        )}
        <Link href="/" className="btn btn-ghost btn-sm rounded-lg gap-1.5">
          <FiHome className="w-3.5 h-3.5" /> Go Home
        </Link>
      </div>
      {showReport && !isOffline && (
        <p className="text-xs text-base-content/30 mt-4">
          If this keeps happening, please{' '}
          <a href="mailto:support@promptverse.com?subject=Error Report" className="underline hover:text-base-content/50">
            report this issue
          </a>
        </p>
      )}
    </motion.div>
  );

  if (fullPage) {
    return <div className="min-h-[60vh] flex items-center justify-center">{content}</div>;
  }

  return content;
}
