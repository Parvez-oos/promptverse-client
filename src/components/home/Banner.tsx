'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowRight, FiZap, FiTrendingUp } from 'react-icons/fi';

const trendingTags = [
  '#ChatGPT', '#Midjourney', '#Claude', '#Gemini', '#DALL-E', '#StableDiffusion',
  '#PromptEngineering', '#AIArt', '#Copywriting', '#Coding', '#Business', '#Creative',
];

export default function Banner() {
  const [search, setSearch] = useState('');
  const [randomTags, setRandomTags] = useState<string[]>([]);
  const router = useRouter();

  useEffect(() => {
    const shuffled = [...trendingTags].sort(() => Math.random() - 0.5);
    setRandomTags(shuffled.slice(0, 6));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/all-prompts?search=${encodeURIComponent(search.trim())}`);
    }
  };

  const handleTagClick = (tag: string) => {
    router.push(`/all-prompts?search=${encodeURIComponent(tag.replace('#', ''))}`);
  };

  return (
    <section className="relative overflow-hidden pt-28 pb-8 lg:pt-36 lg:pb-12">
      <div className="absolute inset-0 mesh-gradient opacity-40" />
      <div className="absolute inset-0">
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute top-20 left-10 w-72 h-72 bg-primary/15 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/15 rounded-full blur-[120px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/8 rounded-full blur-[150px]"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: 'spring', damping: 15, stiffness: 150 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 10, stiffness: 200 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6"
            >
              <FiZap className="w-4 h-4 text-primary" />
              <span className="text-xs font-medium text-primary">The Ultimate AI Prompt Marketplace</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight mb-6 tracking-tight">
              Craft{' '}
              <span className="gradient-text">Better Prompts</span>
              <br />
              Get{' '}
              <span className="gradient-text">Better Results</span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-base sm:text-lg text-base-content/55 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              Discover thousands of expertly crafted AI prompts. Create, share, and monetize your
              prompts while unlocking the full potential of ChatGPT, Gemini, Claude, and more.
            </motion.p>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, type: 'spring', damping: 15, stiffness: 150 }}
            onSubmit={handleSearch}
            className="max-w-2xl mx-auto mb-6"
          >
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ type: 'spring', damping: 15 }}
              className="relative"
            >
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for prompts... (e.g., 'ChatGPT copywriting')"
                className="w-full pl-12 pr-36 py-4 rounded-2xl bg-base-100 border border-base-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 text-base outline-none transition-all duration-200 shadow-sm"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 btn btn-primary btn-sm rounded-xl gap-1.5"
              >
                <FiSearch className="w-4 h-4" />
                Search
              </motion.button>
            </motion.div>
          </motion.form>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4, type: 'spring', damping: 15, stiffness: 150 }}
            className="flex flex-wrap items-center justify-center gap-2"
          >
            <motion.span
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
              className="flex items-center gap-1 text-xs text-base-content/45 mr-1"
            >
              <FiTrendingUp className="w-3.5 h-3.5" /> Trending:
            </motion.span>
            {randomTags.map((tag, i) => (
              <motion.button
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.08, type: 'spring', damping: 12 }}
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleTagClick(tag)}
                className="px-3 py-1 rounded-full bg-base-200/80 hover:bg-primary/10 hover:text-primary text-xs font-medium text-base-content/55 transition-all duration-200"
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6, type: 'spring', damping: 15, stiffness: 150 }}
            className="mt-8 flex items-center justify-center gap-3"
          >
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="/all-prompts"
              className="btn btn-primary rounded-xl gap-2 px-6"
            >
              Explore Prompts <FiArrowRight className="w-4 h-4" />
            </motion.a>
            <motion.a
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              href="/register"
              className="btn btn-outline rounded-xl gap-2 px-6"
            >
              Get Started
            </motion.a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
