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

export function CardSkeleton() {
  return (
    <div className="card bg-base-100 border border-base-300 overflow-hidden">
      <div className="p-6 space-y-4">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-3 w-1/2" />
        <SkeletonBlock className="h-20 w-full" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-6 w-16" />
          <SkeletonBlock className="h-6 w-16" />
          <SkeletonBlock className="h-6 w-16" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 p-4 bg-base-200/50 rounded-lg">
          {Array.from({ length: cols }).map((_, j) => (
            <SkeletonBlock key={j} className="h-4 flex-1" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center gap-4">
        <SkeletonBlock className="w-20 h-20 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <SkeletonBlock className="h-5 w-48" />
          <SkeletonBlock className="h-4 w-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <SkeletonBlock className="h-48 w-full rounded-xl" />
        </div>
        <div className="space-y-4">
          <SkeletonBlock className="h-24 w-full rounded-xl" />
          <SkeletonBlock className="h-24 w-full rounded-xl" />
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <SkeletonBlock className="h-7 w-40" />
          <SkeletonBlock className="h-4 w-56" />
        </div>
        <SkeletonBlock className="h-9 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <SkeletonBlock className="h-72 w-full rounded-xl" />
    </motion.div>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="card bg-base-100 border border-base-300 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <SkeletonBlock className="h-5 w-3/4" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
            <SkeletonBlock className="h-8 w-20 rounded-lg" />
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export function PromptDetailSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-6">
      <SkeletonBlock className="h-8 w-3/4" />
      <div className="flex gap-2">
        <SkeletonBlock className="h-6 w-20 rounded-full" />
        <SkeletonBlock className="h-6 w-24 rounded-full" />
        <SkeletonBlock className="h-6 w-16 rounded-full" />
      </div>
      <SkeletonBlock className="h-64 w-full rounded-xl" />
      <div className="grid grid-cols-3 gap-4">
        <SkeletonBlock className="h-24 rounded-xl" />
        <SkeletonBlock className="h-24 rounded-xl" />
        <SkeletonBlock className="h-24 rounded-xl" />
      </div>
    </motion.div>
  );
}

export function AuthSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen flex items-center justify-center py-16">
      <div className="w-full max-w-md mx-4">
        <div className="card bg-base-100 border border-base-300 p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <SkeletonBlock className="w-8 h-8 rounded-lg mb-6" />
            <SkeletonBlock className="h-7 w-48 mb-2" />
            <SkeletonBlock className="h-4 w-36" />
          </div>
          <SkeletonBlock className="h-11 w-full rounded-xl mb-4" />
          <div className="flex items-center gap-3 mb-6">
            <SkeletonBlock className="h-px flex-1" />
            <SkeletonBlock className="h-3 w-28" />
            <SkeletonBlock className="h-px flex-1" />
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <SkeletonBlock className="h-3 w-12" />
              <SkeletonBlock className="h-11 w-full rounded-xl" />
            </div>
            <div className="space-y-1.5">
              <SkeletonBlock className="h-3 w-16" />
              <SkeletonBlock className="h-11 w-full rounded-xl" />
            </div>
            <SkeletonBlock className="h-11 w-full rounded-xl" />
          </div>
          <div className="flex justify-center mt-6">
            <SkeletonBlock className="h-4 w-44" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function FormSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <SkeletonBlock className="h-9 w-20 rounded-lg mb-6" />
      <div className="max-w-3xl">
        <SkeletonBlock className="h-7 w-48 mb-1" />
        <SkeletonBlock className="h-4 w-64 mb-6" />
        <div className="card bg-base-100 border border-base-300 p-6 space-y-5">
          <SkeletonBlock className="h-11 w-full rounded-xl" />
          <SkeletonBlock className="h-20 w-full rounded-xl" />
          <SkeletonBlock className="h-40 w-full rounded-xl" />
          <div className="grid grid-cols-2 gap-4">
            <SkeletonBlock className="h-11 w-full rounded-xl" />
            <SkeletonBlock className="h-11 w-full rounded-xl" />
            <SkeletonBlock className="h-11 w-full rounded-xl" />
            <SkeletonBlock className="h-11 w-full rounded-xl" />
          </div>
          <SkeletonBlock className="h-11 w-full rounded-xl" />
          <SkeletonBlock className="h-9 w-full rounded-xl" />
          <div className="flex justify-end gap-3 pt-4">
            <SkeletonBlock className="h-10 w-20 rounded-xl" />
            <SkeletonBlock className="h-10 w-36 rounded-xl" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function PaymentSkeleton() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen py-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <SkeletonBlock className="h-8 w-16 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <SkeletonBlock className="h-5 w-36 rounded-full" />
            <SkeletonBlock className="h-10 w-72" />
            <SkeletonBlock className="h-4 w-96" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <SkeletonBlock className="w-6 h-6 rounded-full" />
                  <SkeletonBlock className="h-4 w-48" />
                </div>
              ))}
            </div>
          </div>
          <div className="lg:pl-8">
            <div className="card bg-base-100 border border-base-300 p-8">
              <div className="text-center mb-6 space-y-2">
                <SkeletonBlock className="h-4 w-24 mx-auto" />
                <SkeletonBlock className="h-12 w-32 mx-auto" />
                <SkeletonBlock className="h-4 w-20 mx-auto" />
              </div>
              <SkeletonBlock className="h-3 w-20 mb-2" />
              <SkeletonBlock className="h-12 w-full rounded-xl mb-6" />
              <SkeletonBlock className="h-12 w-full rounded-xl mb-4" />
              <SkeletonBlock className="h-3 w-56 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
