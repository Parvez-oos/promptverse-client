'use client';

import { motion } from 'framer-motion';
import { IPrompt } from '@/types';
import Link from 'next/link';
import { FiCopy, FiStar, FiBookmark, FiLock, FiArrowUpRight, FiGitBranch } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import { formatNumber } from '@/lib/utils';

interface PromptCardProps {
  prompt: IPrompt;
}

const toolGradients: Record<string, string> = {
  ChatGPT: 'from-emerald-500/80 to-teal-600/80',
  Midjourney: 'from-violet-500/80 to-purple-600/80',
  Claude: 'from-orange-400/80 to-amber-500/80',
  Gemini: 'from-blue-500/80 to-indigo-600/80',
  'DALL-E': 'from-pink-500/80 to-rose-600/80',
  'Stable Diffusion': 'from-cyan-500/80 to-sky-600/80',
  Copilot: 'from-sky-400/80 to-blue-500/80',
};

const categoryIcons: Record<string, string> = {
  Writing: '✍️',
  Coding: '💻',
  Marketing: '📢',
  Design: '🎨',
  Business: '💼',
  Education: '📚',
  Creative: '✨',
};

export default function PromptCard({ prompt }: PromptCardProps) {
  const { isAuthenticated } = useAuth();

  const isLocked = prompt.visibility === 'private';
  const gradient = toolGradients[prompt.aiTool] || 'from-primary/80 to-secondary/80';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', damping: 15, stiffness: 300 }}
    >
      <div
        className="relative flex flex-col h-full rounded-2xl bg-base-100 border border-base-300 overflow-hidden transition-all duration-300 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5"
      >
        <div className="relative h-36 overflow-hidden">
          {prompt.thumbnail ? (
            <motion.img
              whileHover={{ scale: 1.08 }}
              transition={{ duration: 0.5 }}
              src={prompt.thumbnail}
              alt={prompt.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
              <span className="text-4xl opacity-60">{categoryIcons[prompt.category] || '🧠'}</span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-transparent opacity-60" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            {prompt.isFeatured && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-400/90 text-amber-900 text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm"
              >
                <FiStar className="w-3 h-3" /> Featured
              </motion.span>
            )}
            {isLocked && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-violet-500/90 text-white text-[10px] font-bold uppercase tracking-wider shadow-lg backdrop-blur-sm"
              >
                <FiLock className="w-3 h-3" /> Premium
              </motion.span>
            )}
          </div>

          <div className="absolute bottom-3 right-3">
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-md backdrop-blur-sm ${
              prompt.difficultyLevel === 'Beginner' ? 'bg-emerald-400/90 text-emerald-900' :
              prompt.difficultyLevel === 'Intermediate' ? 'bg-amber-400/90 text-amber-900' :
              'bg-rose-400/90 text-rose-900'
            }`}>
              {prompt.difficultyLevel}
            </span>
          </div>
        </div>

        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-1.5 mb-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/8 text-primary text-[11px] font-semibold">
              {prompt.aiTool}
            </span>
            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-base-200 text-base-content/60 text-[11px] font-medium">
              {prompt.category}
            </span>
          </div>

          <h3 className="font-bold text-[15px] leading-snug mb-1.5 line-clamp-2">
            {prompt.title}
          </h3>

          <p className="text-xs text-base-content/50 line-clamp-2 mb-3 leading-relaxed flex-1">
            {prompt.description}
          </p>

          {prompt.tags && prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {prompt.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-[10px] text-primary/60 bg-primary/5 px-1.5 py-0.5 rounded font-medium">
                  #{tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="text-[10px] text-base-content/30 font-medium">
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-base-300/50 mt-auto">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-[9px] font-bold text-primary ring-1 ring-base-100">
                {prompt.creator?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-[11px] text-base-content/45 font-medium truncate max-w-[80px]">
                {prompt.creator?.name || 'Unknown'}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              {prompt.forkCount > 0 && (
                <span className="flex items-center gap-0.5 text-[11px] text-base-content/40">
                  <FiGitBranch className="w-3 h-3" /> {formatNumber(prompt.forkCount)}
                </span>
              )}
              <span className="flex items-center gap-0.5 text-[11px] text-base-content/40">
                <FiCopy className="w-3 h-3" /> {formatNumber(prompt.copyCount)}
              </span>
              {prompt.averageRating ? (
                <span className="flex items-center gap-0.5 text-[11px] text-amber-500 font-medium">
                  <FiStar className="w-3 h-3 fill-amber-400" /> {prompt.averageRating.toFixed(1)}
                </span>
              ) : null}
              <Link
                href={isAuthenticated ? `/prompts/${prompt._id}` : '/login'}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-primary text-white text-[11px] font-semibold hover:bg-primary/90 transition-all duration-200"
              >
                View Details <FiArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
