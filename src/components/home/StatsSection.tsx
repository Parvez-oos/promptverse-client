'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { FiUsers, FiFileText, FiCopy, FiStar } from 'react-icons/fi';

const stats = [
  { icon: FiUsers, label: 'Active Users', value: '10K+' },
  { icon: FiFileText, label: 'Total Prompts', value: '5K+' },
  { icon: FiCopy, label: 'Copies Made', value: '100K+' },
  { icon: FiStar, label: 'Reviews', value: '8K+' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring' as const, damping: 15, stiffness: 200 },
  },
};

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <motion.div
      ref={ref}
      variants={itemVariants}
      className="text-center p-6"
    >
      <motion.div
        animate={isInView ? { scale: [0.8, 1.1, 1] } : {}}
        transition={{ duration: 0.5, delay: index * 0.12 }}
        className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
      >
        <stat.icon className="w-7 h-7 text-primary" />
      </motion.div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : {}}
        transition={{ delay: 0.3 + index * 0.12 }}
        className="text-3xl sm:text-4xl font-bold gradient-text mb-1"
      >
        {stat.value}
      </motion.p>
      <p className="text-sm text-base-content/55">{stat.label}</p>
    </motion.div>
  );
}

export default function StatsSection() {
  return (
    <section className="py-12 lg:py-16 relative overflow-hidden">
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <StatCard key={stat.label} stat={stat} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
