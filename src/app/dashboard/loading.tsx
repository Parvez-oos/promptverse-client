'use client';

import { motion } from 'framer-motion';

function SkeletonBlock({ className = '' }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`animate-pulse bg-base-300/60 rounded ${className}`}
    />
  );
}

export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="space-y-2">
          <SkeletonBlock className="h-8 w-64" />
          <SkeletonBlock className="h-4 w-48" />
        </div>
        <SkeletonBlock className="h-9 w-32 rounded-xl" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="card bg-base-100 border border-base-300 p-5">
            <div className="flex justify-between mb-3">
              <SkeletonBlock className="w-10 h-10 rounded-xl" />
              <SkeletonBlock className="h-5 w-20 rounded-full" />
            </div>
            <SkeletonBlock className="h-7 w-16 mb-1" />
            <SkeletonBlock className="h-4 w-24" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="card bg-base-100 border border-base-300 p-6">
            <SkeletonBlock className="h-5 w-40 mb-1" />
            <SkeletonBlock className="h-3 w-28 mb-6" />
            <SkeletonBlock className="h-56 w-full" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card bg-base-100 border border-base-300 p-6">
          <SkeletonBlock className="h-5 w-36 mb-1" />
          <SkeletonBlock className="h-3 w-24 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 py-3 border-b border-base-300/50 last:border-0">
              <SkeletonBlock className="w-8 h-8 rounded-lg shrink-0" />
              <div className="flex-1 space-y-1">
                <SkeletonBlock className="h-4 w-40" />
                <SkeletonBlock className="h-3 w-28" />
              </div>
              <SkeletonBlock className="h-3 w-16" />
            </div>
          ))}
        </div>
        <div className="space-y-6">
          <div className="card bg-base-100 border border-base-300 p-5">
            <SkeletonBlock className="h-5 w-32 mb-4" />
            <div className="flex items-center gap-3 mb-3">
              <SkeletonBlock className="w-11 h-11 rounded-full" />
              <div className="space-y-1 flex-1">
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="h-3 w-36" />
              </div>
            </div>
            <div className="flex gap-2">
              <SkeletonBlock className="h-5 w-14 rounded-full" />
              <SkeletonBlock className="h-5 w-16 rounded-full" />
            </div>
          </div>
          <div className="card bg-base-100 border border-base-300 p-5">
            <SkeletonBlock className="h-5 w-28 mb-3" />
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <SkeletonBlock key={i} className="h-20 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
