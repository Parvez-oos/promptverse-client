'use client';

import { useRef, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface InfiniteScrollProps {
  loadMore: () => void;
  hasMore: boolean;
  isLoading: boolean;
  loader?: ReactNode;
  children: ReactNode;
}

export default function InfiniteScroll({ loadMore, hasMore, isLoading, loader, children }: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    const sentinel = sentinelRef.current;
    if (sentinel) observer.observe(sentinel);

    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [hasMore, isLoading, loadMore]);

  return (
    <>
      {children}
      <div ref={sentinelRef} className="h-4" />
      {isLoading && (
        loader || (
          <div className="flex justify-center py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
              className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
            />
          </div>
        )
      )}
      {!hasMore && !isLoading && (
        <div className="text-center py-8 text-sm text-base-content/40">
          You&apos;ve reached the end
        </div>
      )}
    </>
  );
}
