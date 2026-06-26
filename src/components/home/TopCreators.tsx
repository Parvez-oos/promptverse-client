'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiAward, FiCopy, FiFileText, FiTrendingUp } from 'react-icons/fi';
import { userService } from '@/services/userService';
import { formatNumber } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const transitionSpring = { type: 'spring' as const, damping: 20, stiffness: 200 };
const transitionSpringLight = { type: 'spring' as const, damping: 15 };

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitionSpring,
  },
};

export default function TopCreators() {
  const { data, isLoading } = useQuery({
    queryKey: ['topCreators'],
    queryFn: () => userService.getTopCreators(),
  });

  const creators = data?.data || [];

  return (
    <section className="section-padding relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-80 h-80 bg-accent/8 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={transitionSpring}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-primary text-sm font-medium mb-2"
          >
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <FiAward className="w-4 h-4" />
            </motion.div>
            <span>Top Creators</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
            Meet Our <span className="gradient-text">Top Creators</span>
          </h2>
          <p className="text-base-content/55">
            Discover the most active and talented prompt creators in our community.
          </p>
        </motion.div>

        {isLoading ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="card bg-base-100 border border-base-300 p-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-base-300 animate-pulse" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-base-300 animate-pulse rounded w-3/4" />
                    <div className="h-3 bg-base-300 animate-pulse rounded w-1/2" />
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {creators.map((creator: any, i: number) => (
              <motion.div
                key={creator._id}
                variants={itemVariants}
                whileHover={{ y: -3, transition: transitionSpringLight }}
                className="card bg-base-100 border border-base-300 p-6 relative overflow-hidden group"
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute top-3 right-3"
                >
                  <span className="text-[10px] font-bold text-primary/40">#{i + 1}</span>
                </motion.div>
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg overflow-hidden flex-shrink-0 ring-2 ring-base-100 shadow-sm"
                  >
                    {creator.photoURL ? (
                      <img src={creator.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      creator.name?.charAt(0)?.toUpperCase()
                    )}
                  </motion.div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">{creator.name}</h3>
                    <p className="text-xs text-base-content/45 capitalize flex items-center gap-1">
                      {creator.role}
                      {i === 0 && <FiTrendingUp className="w-3 h-3 text-primary" />}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-base-300/50">
                  <div className="flex items-center gap-1.5 text-xs text-base-content/50">
                    <FiFileText className="w-3.5 h-3.5" />
                    <span>{formatNumber(creator.totalPrompts)} prompts</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-base-content/50">
                    <FiCopy className="w-3.5 h-3.5" />
                    <span>{formatNumber(creator.totalCopies)} copies</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
