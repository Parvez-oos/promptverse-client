'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiArrowRight, FiTrendingUp } from 'react-icons/fi';
import { promptService } from '@/services/promptService';
import PromptCard from '@/components/prompts/PromptCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import Link from 'next/link';

export default function FeaturedPrompts() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['trendingPrompts'],
    queryFn: async () => {
      try {
        const res = await promptService.getTrending();
        return res;
      } catch {
        const res = await promptService.getFeatured();
        return res;
      }
    },
  });

  const prompts = data?.data || [];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-secondary/5 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 text-primary text-sm font-medium mb-2"
            >
              <motion.div
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              >
                <FiTrendingUp className="w-4 h-4" />
              </motion.div>
              <span>Trending Now</span>
            </motion.div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Featured <span className="gradient-text">Prompts</span>
            </h2>
            <p className="text-base-content/55 mt-2 max-w-lg">
              Discover the most popular and highest-quality prompts curated by our community.
            </p>
          </div>
          <Link href="/all-prompts" className="btn btn-ghost btn-sm rounded-xl gap-1.5 group">
            View All <FiArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.06 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                <CardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : isError ? (
          <ErrorDisplay message="Failed to load featured prompts." onRetry={refetch} />
        ) : prompts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-base-content/40">No featured prompts yet.</p>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            variants={{
              visible: { transition: { staggerChildren: 0.08 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {prompts.slice(0, 6).map((prompt: any) => (
              <motion.div
                key={prompt._id}
                layout
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', damping: 20, stiffness: 200, duration: 0.5 } },
                }}
                whileHover={{ y: -4, transition: { type: 'spring', damping: 15 } }}
              >
                <PromptCard prompt={prompt} />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
