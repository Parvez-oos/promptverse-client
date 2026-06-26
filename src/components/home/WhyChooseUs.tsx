'use client';

import { motion } from 'framer-motion';
import { FiShield, FiZap, FiUsers, FiLayers, FiAward, FiGlobe } from 'react-icons/fi';

const features = [
  {
    icon: FiZap,
    title: 'Curated Quality',
    description: 'Every prompt is reviewed and approved by our team to ensure the highest quality standards.',
    color: 'from-yellow-400/20 to-amber-500/20',
    iconColor: 'text-amber-500',
  },
  {
    icon: FiShield,
    title: 'Secure & Private',
    description: 'Your prompts and data are protected with enterprise-grade security and encryption.',
    color: 'from-emerald-400/20 to-teal-500/20',
    iconColor: 'text-emerald-500',
  },
  {
    icon: FiUsers,
    title: 'Community Driven',
    description: 'Join thousands of creators and collaborate in a thriving AI prompt ecosystem.',
    color: 'from-blue-400/20 to-indigo-500/20',
    iconColor: 'text-blue-500',
  },
  {
    icon: FiLayers,
    title: 'Multiple AI Tools',
    description: 'Prompts optimized for ChatGPT, Gemini, Claude, Midjourney, and 50+ AI tools.',
    color: 'from-violet-400/20 to-purple-500/20',
    iconColor: 'text-violet-500',
  },
  {
    icon: FiAward,
    title: 'Premium Benefits',
    description: 'Unlock private prompts, advanced analytics, and priority support with Premium.',
    color: 'from-rose-400/20 to-pink-500/20',
    iconColor: 'text-rose-500',
  },
  {
    icon: FiGlobe,
    title: 'Global Reach',
    description: 'Access prompts from creators worldwide in multiple languages and categories.',
    color: 'from-cyan-400/20 to-sky-500/20',
    iconColor: 'text-cyan-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const transitionSpring = { type: 'spring' as const, damping: 20, stiffness: 200 };

const itemVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitionSpring,
  },
};

export default function WhyChooseUs() {
  return (
    <section className="section-padding bg-base-200/50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-20 w-64 h-64 bg-primary/8 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-20 w-64 h-64 bg-secondary/8 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={transitionSpring}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
            Why Choose <span className="gradient-text">PromptVerse</span>
          </h2>
          <p className="text-base-content/55 leading-relaxed">
            We provide everything you need to create, discover, and share exceptional AI prompts.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { type: 'spring', damping: 15 } }}
              className="card bg-base-100 border border-base-300 p-6 relative overflow-hidden group"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              <div className="relative z-10">
                <motion.div
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                  className={`w-12 h-12 rounded-xl bg-base-200 flex items-center justify-center mb-4 ${feature.iconColor}`}
                >
                  <feature.icon className="w-6 h-6" />
                </motion.div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-base-content/55 leading-relaxed">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
