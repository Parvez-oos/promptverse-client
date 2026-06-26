'use client';

import { useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';
import {
  FiCopy, FiBookmark, FiFlag, FiStar, FiArrowLeft, FiLock, FiUser,
  FiBarChart2, FiTag, FiTool, FiCheck, FiCpu, FiGitBranch, FiDownload, FiArrowUpRight,
} from 'react-icons/fi';
import { promptService } from '@/services/promptService';
import { reviewService } from '@/services/reviewService';
import { bookmarkService } from '@/services/bookmarkService';
import { reportService } from '@/services/reportService';
import { useAuth } from '@/providers/AuthProvider';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';
import SocialShare from '@/components/prompts/SocialShare';
import AITestModal from '@/components/prompts/AITestModal';
import { useSocket } from '@/providers/SocketProvider';
import toast from 'react-hot-toast';
import { formatDate, formatNumber } from '@/lib/utils';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(2, 'Comment must be at least 2 characters').max(1000),
});

const reportSchema = z.object({
  reason: z.string().min(1, 'Please select a reason'),
  description: z.string().max(1000).optional(),
});

type ReviewForm = z.infer<typeof reviewSchema>;
type ReportForm = z.infer<typeof reportSchema>;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20, stiffness: 200 } },
};

export default function PromptDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isPremium } = useAuth();
  const { socket } = useSocket();

  const [showReportModal, setShowReportModal] = useState(false);
  const [showAITest, setShowAITest] = useState(false);
  const [copied, setCopied] = useState(false);
  const [forking, setForking] = useState(false);

  const { data: promptData, isLoading, isError, refetch } = useQuery({
    queryKey: ['prompt', id],
    queryFn: () => promptService.getById(id),
    enabled: !!id,
  });

  const { data: reviewsData, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getPromptReviews(id),
    enabled: !!id,
  });

  const prompt = promptData?.data;
  const reviews = reviewsData?.data || [];

  const bookmarkMutation = useMutation({
    mutationFn: () => bookmarkService.toggle(id),
    onSuccess: (data) => {
      toast.success(data.message);
      refetch();
    },
    onError: () => toast.error('Failed to toggle bookmark'),
  });

  const copyMutation = useMutation({
    mutationFn: () => promptService.incrementCopy(id),
    onSuccess: () => {
      navigator.clipboard.writeText(prompt?.content || '');
      setCopied(true);
      toast.success('Copied to clipboard!');
      refetch();
      setTimeout(() => setCopied(false), 2000);
    },
    onError: () => toast.error('Failed to copy'),
  });

  const forkMutation = useMutation({
    mutationFn: () => promptService.fork(id),
    onSuccess: (data) => {
      toast.success('Prompt forked! Redirecting to your dashboard...');
      router.push('/dashboard/my-prompts');
    },
    onError: (error: any) => toast.error(error?.response?.data?.message || 'Failed to fork prompt'),
  });

  const reviewForm = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: '' },
  });

  const reportForm = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
  });

  const submitReview = async (data: ReviewForm) => {
    try {
      await reviewService.create(id, data);
      toast.success('Review submitted!');
      reviewForm.reset();
      refetch();
      refetchReviews();
      if (socket) {
        socket.emit('notification:send', {
          type: 'review',
          message: `${user?.name} reviewed your prompt`,
          promptId: id,
        });
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit review');
    }
  };

  const submitReport = async (data: ReportForm) => {
    try {
      await reportService.create(id, data);
      toast.success('Report submitted. Our team will review it.');
      setShowReportModal(false);
      reportForm.reset();
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to submit report');
    }
  };

  const downloadPDF = useCallback(() => {
    if (!prompt) return;
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;

      doc.setFontSize(18);
      doc.text(prompt.title, margin, 30);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`By ${prompt.creator?.name || 'Unknown'} | ${prompt.category} | ${prompt.aiTool}`, margin, 40);
      doc.text(`Difficulty: ${prompt.difficultyLevel} | Copies: ${prompt.copyCount}`, margin, 46);

      doc.setFontSize(12);
      doc.setTextColor(0);
      const descLines = doc.splitTextToSize(prompt.description, pageWidth - margin * 2);
      doc.text(descLines, margin, 58);

      let yPos = 58 + descLines.length * 6 + 10;
      doc.setFontSize(14);
      doc.text('Prompt Content', margin, yPos);
      yPos += 8;
      doc.setFontSize(10);
      const contentLines = doc.splitTextToSize(prompt.content, pageWidth - margin * 2);
      doc.text(contentLines, margin, yPos);

      const totalPages = (doc.internal as any).getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(180);
        doc.text(`PromptVerse - ${prompt.title}`, margin, doc.internal.pageSize.getHeight() - 10);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth - margin - 20, doc.internal.pageSize.getHeight() - 10);
      }

      doc.save(`${prompt.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      toast.success('PDF downloaded!');
    } catch {
      toast.error('Failed to generate PDF');
    }
  }, [prompt]);

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (isError || !prompt) return <ErrorDisplay message="Prompt not found." onRetry={refetch} />;

  const isLocked = prompt.isLocked;

  return (
    <motion.div
      className="min-h-screen"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 mesh-gradient opacity-40" />
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[120px] animate-float hidden lg:block" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/8 rounded-full blur-[150px] animate-float hidden lg:block" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/5 rounded-full blur-[100px] animate-breathe hidden lg:block" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 lg:pb-16">
          <motion.button
            variants={itemVariants}
            whileHover={{ x: -3 }}
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-base-content/50 hover:text-base-content bg-base-100/60 hover:bg-base-100 border border-base-300/50 hover:border-base-300 backdrop-blur-sm transition-all duration-200 mb-6"
          >
            <FiArrowLeft className="w-3.5 h-3.5" /> Back
          </motion.button>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2 mb-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/10 text-primary border border-primary/20">
              <FiTag className="w-3 h-3" /> {prompt.category}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-secondary/10 text-secondary border border-secondary/20">
              <FiTool className="w-3 h-3" /> {prompt.aiTool}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${
              prompt.difficultyLevel === 'Beginner' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' :
              prompt.difficultyLevel === 'Intermediate' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' :
              'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
            }`}>
              {prompt.difficultyLevel}
            </span>
            {prompt.visibility === 'private' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
                <FiLock className="w-3 h-3" /> Premium
              </span>
            )}
            {prompt.isFeatured && (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                <FiStar className="w-3 h-3" /> Featured
              </span>
            )}
          </motion.div>

          <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            {prompt.title}
          </motion.h1>

          <motion.p variants={itemVariants} className="text-base sm:text-lg text-base-content/60 leading-relaxed max-w-3xl mb-6">
            {prompt.description}
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold ring-2 ring-base-100 shadow-lg">
                  {prompt.creator?.photoURL ? (
                    <img src={prompt.creator.photoURL} alt="" className="w-full h-full object-cover rounded-full" />
                  ) : (
                    prompt.creator?.name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-base-100" />
              </div>
              <div>
                <p className="text-sm font-semibold">{prompt.creator?.name || 'Unknown'}</p>
                <p className="text-[11px] text-base-content/40">{formatDate(prompt.createdAt)}</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-8 bg-base-300" />
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-base-content/50">
                <FiCopy className="w-4 h-4" /> <span className="font-semibold text-base-content">{formatNumber(prompt.copyCount)}</span> copies
              </span>
              {prompt.forkCount > 0 && (
                <span className="flex items-center gap-1.5 text-base-content/50">
                  <FiGitBranch className="w-4 h-4" /> <span className="font-semibold text-base-content">{formatNumber(prompt.forkCount)}</span> forks
                </span>
              )}
              {prompt.averageRating ? (
                <span className="flex items-center gap-1.5 text-base-content/50">
                  <FiStar className="w-4 h-4 text-amber-500 fill-amber-500" /> <span className="font-semibold text-base-content">{prompt.averageRating.toFixed(1)}</span>
                </span>
              ) : null}
              <span className="flex items-center gap-1.5 text-base-content/50">
                <FiBarChart2 className="w-4 h-4" /> <span className="font-semibold text-base-content">{prompt.reviewCount || 0}</span> reviews
              </span>
            </div>
          </motion.div>

          {prompt.originalPrompt && (
            <motion.div variants={itemVariants} className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/5 text-primary text-xs font-medium border border-primary/10">
              <FiGitBranch className="w-3.5 h-3.5" />
              <span>Forked from an existing prompt</span>
            </motion.div>
          )}

          {prompt.tags?.length > 0 && (
            <motion.div variants={itemVariants} className="flex flex-wrap gap-2 mt-5">
              {prompt.tags.map((tag: string, i: number) => (
                <motion.span
                  key={tag}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * i }}
                  className="text-xs font-medium bg-base-100/80 backdrop-blur-sm text-base-content/60 px-3 py-1 rounded-full border border-base-300/50 hover:border-primary/30 hover:text-primary transition-colors duration-200"
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 -mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {isLocked ? (
              <motion.div
                variants={itemVariants}
                className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-base-200 via-base-100 to-base-200 border border-base-300/80 p-8 lg:p-10 text-center group"
              >
                <div className="absolute inset-0 mesh-gradient opacity-30" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]" />
                <div className="relative z-10">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100 }}
                    className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-xl shadow-violet-500/20"
                  >
                    <FiLock className="w-7 h-7 text-white" />
                  </motion.div>
                  <h3 className="text-xl font-bold mb-2 gradient-text">Premium Prompt</h3>
                  <p className="text-sm text-base-content/60 mb-6 max-w-md mx-auto leading-relaxed">
                    This prompt is exclusive to Premium members. Subscribe to unlock the full content, copy it, and leave reviews.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
                    <span className="inline-flex items-center gap-1.5 text-xs text-base-content/50 bg-base-100/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-base-300/50">
                      <FiCopy className="w-3 h-3" /> Copy access
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-base-content/50 bg-base-100/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-base-300/50">
                      <FiStar className="w-3 h-3" /> Review access
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs text-base-content/50 bg-base-100/60 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-base-300/50">
                      <FiGitBranch className="w-3 h-3" /> Fork access
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => router.push('/payment')}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-shadow"
                  >
                    Subscribe to Premium - $5 <FiArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ) : (
              <>
                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl bg-base-100 border border-base-300/80 overflow-hidden gradient-border"
                >
                  <div className="px-6 lg:px-8 py-4 bg-gradient-to-r from-primary/5 via-secondary/5 to-transparent border-b border-base-300/50 flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <FiBarChart2 className="w-4 h-4 text-primary" />
                    </div>
                    <h3 className="font-semibold text-sm">Prompt Content</h3>
                  </div>
                  <div className="p-6 lg:p-8">
                    {isAuthenticated ? (
                      <MarkdownRenderer content={prompt.content} />
                    ) : (
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-base-100/50 to-base-100 z-10" />
                        <MarkdownRenderer content={prompt.content} />
                        <div className="relative z-20 mt-4 text-center">
                          <p className="text-sm text-base-content/50 mb-3">Sign in to view the full prompt content</p>
                          <a href="/login" className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary/90 transition-colors">
                            Sign In <FiArrowUpRight className="w-4 h-4" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>

                {prompt.usageInstructions && (
                  <motion.div variants={itemVariants} className="rounded-2xl bg-base-100 border border-base-300/80 overflow-hidden gradient-border">
                    <div className="px-6 lg:px-8 py-4 bg-gradient-to-r from-amber-500/5 via-accent/5 to-transparent border-b border-base-300/50 flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                        <FiTool className="w-4 h-4 text-accent" />
                      </div>
                      <h3 className="font-semibold text-sm">Usage Instructions</h3>
                    </div>
                    <div className="p-6 lg:p-8">
                      <MarkdownRenderer content={prompt.usageInstructions} />
                    </div>
                  </motion.div>
                )}

                <motion.div variants={itemVariants} className="rounded-2xl bg-base-100 border border-base-300/80 p-6 lg:p-8">
                  <div className="flex flex-wrap items-center gap-3">
                    {isAuthenticated ? (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => copyMutation.mutate()}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-shadow"
                        >
                          {copied ? (
                            <><FiCheck className="w-4 h-4" /> Copied!</>
                          ) : (
                            <><FiCopy className="w-4 h-4" /> Copy Prompt</>
                          )}
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => forkMutation.mutate()}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base-200/80 hover:bg-base-200 border border-base-300/60 text-sm font-semibold transition-colors"
                        >
                          <FiGitBranch className="w-4 h-4" /> Fork
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.02, y: -1 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowAITest(true)}
                          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base-200/80 hover:bg-base-200 border border-base-300/60 text-sm font-semibold transition-colors"
                        >
                          <FiCpu className="w-4 h-4" /> Test
                        </motion.button>

                        <div className="flex-1" />

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={downloadPDF}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-base-200/80 hover:bg-base-200 border border-base-300/60 text-base-content/50 hover:text-base-content transition-colors"
                          title="Download PDF"
                        >
                          <FiDownload className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => bookmarkMutation.mutate()}
                          className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border transition-colors ${
                            prompt.isBookmarked
                              ? 'bg-secondary/10 border-secondary/30 text-secondary'
                              : 'bg-base-200/80 hover:bg-base-200 border-base-300/60 text-base-content/50 hover:text-base-content'
                          }`}
                          title={prompt.isBookmarked ? 'Remove Bookmark' : 'Bookmark'}
                        >
                          <FiBookmark className="w-4 h-4" />
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowReportModal(true)}
                          className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-base-200/80 hover:bg-base-200 border border-base-300/60 text-base-content/50 hover:text-error transition-colors"
                          title="Report"
                        >
                          <FiFlag className="w-4 h-4" />
                        </motion.button>
                      </>
                    ) : (
                      <div className="w-full flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/10">
                        <p className="text-sm text-base-content/60">
                          <span className="font-semibold text-primary">Sign in</span> to copy, bookmark, fork, or test this prompt
                        </p>
                        <a href="/login" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-white text-xs font-semibold hover:bg-primary/90 transition-colors">
                          Sign In <FiArrowUpRight className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 pt-5 border-t border-base-300/40">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-base-content/40 uppercase tracking-widest">Share</span>
                      <SocialShare
                        url={typeof window !== 'undefined' ? window.location.href : ''}
                        title={prompt.title}
                        description={prompt.description}
                      />
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="rounded-2xl bg-base-100 border border-base-300/80 overflow-hidden gradient-border"
                >
                  <div className="px-6 lg:px-8 py-4 bg-gradient-to-r from-amber-500/5 via-warning/5 to-transparent border-b border-base-300/50 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
                        <FiStar className="w-4 h-4 text-warning" />
                      </div>
                      <h3 className="font-semibold text-sm">
                        Reviews <span className="text-base-content/40 font-normal">({reviews.length})</span>
                      </h3>
                    </div>
                    {prompt.averageRating ? (
                      <div className="flex items-center gap-1.5">
                        <div className="flex items-center gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FiStar
                              key={i}
                              className={`w-3 h-3 ${i < Math.round(prompt.averageRating!) ? 'text-warning fill-warning' : 'text-base-content/20'}`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-bold">{prompt.averageRating.toFixed(1)}</span>
                      </div>
                    ) : null}
                  </div>

                  <div className="p-6 lg:p-8">
                    {isAuthenticated && (
                      <form onSubmit={reviewForm.handleSubmit(submitReview)} className="mb-8 p-5 rounded-xl bg-gradient-to-br from-base-200/80 to-base-200/40 border border-base-300/50">
                        <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                          <FiStar className="w-4 h-4 text-warning" /> Write a Review
                        </h4>
                        <div className="flex items-center gap-1.5 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <motion.button
                              key={star}
                              type="button"
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => reviewForm.setValue('rating', star)}
                              className="transition-colors"
                            >
                              <FiStar
                                className={`w-7 h-7 ${
                                  star <= (reviewForm.watch('rating') || 0)
                                    ? 'text-warning fill-warning drop-shadow-sm'
                                    : 'text-base-content/20 hover:text-base-content/40'
                                }`}
                              />
                            </motion.button>
                          ))}
                          <span className="ml-2 text-xs text-base-content/40">
                            {reviewForm.watch('rating') || 0} / 5
                          </span>
                        </div>
                        <textarea
                          {...reviewForm.register('comment')}
                          placeholder="Share your thoughts about this prompt..."
                          className="textarea textarea-bordered w-full rounded-xl text-sm bg-base-100/80 backdrop-blur-sm border-base-300/50 focus:border-primary/40 mb-3"
                          rows={3}
                        />
                        {reviewForm.formState.errors.comment && (
                          <p className="text-xs text-error mb-2 flex items-center gap-1">
                            <FiFlag className="w-3 h-3" /> {reviewForm.formState.errors.comment.message}
                          </p>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          type="submit"
                          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold shadow-lg shadow-primary/20"
                        >
                          <FiStar className="w-3.5 h-3.5" /> Submit Review
                        </motion.button>
                      </form>
                    )}

                    {reviews.length === 0 ? (
                      <div className="text-center py-10">
                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-base-200 flex items-center justify-center">
                          <FiStar className="w-5 h-5 text-base-content/30" />
                        </div>
                        <p className="text-sm text-base-content/40">No reviews yet. Be the first to review!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review: any) => (
                          <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                            className="group p-4 sm:p-5 rounded-xl bg-base-200/30 hover:bg-base-200/50 border border-base-300/40 hover:border-base-300/60 transition-all duration-200"
                          >
                            <div className="flex items-start justify-between gap-4 mb-3">
                              <div className="flex items-center gap-3">
                                <div className="relative">
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-sm font-bold text-primary ring-2 ring-base-100"
                                  >
                                    {review.user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                  </motion.div>
                                </div>
                                <div>
                                  <p className="text-sm font-semibold">{review.user?.name || 'Anonymous'}</p>
                                  <p className="text-[11px] text-base-content/40">{review.user?.email}</p>
                                  <p className="text-[11px] text-base-content/40">{formatDate(review.createdAt)}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-0.5 shrink-0">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <FiStar
                                    key={i}
                                    className={`w-3.5 h-3.5 ${i < review.rating ? 'text-warning fill-warning' : 'text-base-content/20'}`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-base-content/70 leading-relaxed">{review.comment}</p>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              </>
            )}
          </div>

          <div className="space-y-6">
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -2 }}
              className="rounded-2xl bg-base-100 border border-base-300/80 overflow-hidden gradient-border"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-base-300/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <FiUser className="w-4 h-4 text-primary" /> Creator
                </h3>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-lg overflow-hidden">
                      {prompt.creator?.photoURL ? (
                        <img src={prompt.creator.photoURL} alt="" className="w-full h-full object-cover" />
                      ) : (
                        prompt.creator?.name?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-emerald-500 rounded-full border-2 border-base-100" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{prompt.creator?.name || 'Unknown'}</p>
                    <p className="text-xs text-base-content/50 capitalize flex items-center gap-1.5 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                      {prompt.creator?.role || 'user'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -2 }}
              transition={{ delay: 0.05 }}
              className="rounded-2xl bg-base-100 border border-base-300/80 overflow-hidden gradient-border"
            >
              <div className="px-5 py-4 bg-gradient-to-r from-accent/5 to-primary/5 border-b border-base-300/50">
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <FiBarChart2 className="w-4 h-4 text-accent" /> Statistics
                </h3>
              </div>
              <div className="p-5 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-base-content/50 flex items-center gap-1.5">
                      <FiCopy className="w-3.5 h-3.5" /> Copies
                    </span>
                    <motion.span
                      key={prompt.copyCount}
                      initial={{ scale: 1.3 }}
                      animate={{ scale: 1 }}
                      className="font-bold"
                    >
                      {formatNumber(prompt.copyCount)}
                    </motion.span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-base-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((prompt.copyCount / 100) * 100, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-base-content/50 flex items-center gap-1.5">
                      <FiGitBranch className="w-3.5 h-3.5" /> Forks
                    </span>
                    <span className="font-bold">{formatNumber(prompt.forkCount || 0)}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-base-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(((prompt.forkCount || 0) / 50) * 100, 100)}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                      className="h-full rounded-full bg-gradient-to-r from-secondary to-accent"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-base-content/50 flex items-center gap-1.5">
                    <FiStar className="w-3.5 h-3.5" /> Rating
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FiStar
                          key={i}
                          className={`w-3 h-3 ${i < Math.round(prompt.averageRating || 0) ? 'text-warning fill-warning' : 'text-base-content/20'}`}
                        />
                      ))}
                    </div>
                    <span className="font-bold">{prompt.averageRating ? prompt.averageRating.toFixed(1) : 'N/A'}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm pt-3 border-t border-base-300/40">
                  <span className="text-base-content/50">Reviews</span>
                  <span className="font-bold">{prompt.reviewCount || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-base-content/50">Status</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    prompt.status === 'approved' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' :
                    prompt.status === 'pending' ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400' :
                    'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                  }`}>
                    {prompt.status}
                  </span>
                </div>
              </div>
            </motion.div>

            {prompt.aiTool && (
              <motion.div
                variants={itemVariants}
                whileHover={{ y: -2 }}
                transition={{ delay: 0.1 }}
                className="rounded-2xl bg-base-100 border border-base-300/80 overflow-hidden gradient-border"
              >
                <div className="px-5 py-4 bg-gradient-to-r from-secondary/5 to-primary/5 border-b border-base-300/50">
                  <h3 className="font-semibold text-sm flex items-center gap-2">
                    <FiCpu className="w-4 h-4 text-secondary" /> AI Tool
                  </h3>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-primary/20 flex items-center justify-center">
                      <FiTool className="w-5 h-5 text-secondary" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{prompt.aiTool}</p>
                      <p className="text-xs text-base-content/40">AI Platform</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {showReportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setShowReportModal(false)}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md rounded-2xl bg-base-100 border border-base-300/80 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-error via-primary to-secondary" />
            <div className="p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-error/10 flex items-center justify-center">
                  <FiFlag className="w-5 h-5 text-error" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Report Prompt</h3>
                  <p className="text-xs text-base-content/40">Help us keep the community safe</p>
                </div>
              </div>
              <form onSubmit={reportForm.handleSubmit(submitReport)}>
                <div className="mb-4">
                  <label className="text-xs font-semibold mb-1.5 block text-base-content/70">Reason</label>
                  <select {...reportForm.register('reason')} className="select select-bordered w-full rounded-xl text-sm bg-base-200/50 border-base-300/50 focus:border-primary/40">
                    <option value="">Select a reason</option>
                    <option value="Inappropriate Content">Inappropriate Content</option>
                    <option value="Spam">Spam</option>
                    <option value="Copyright Violation">Copyright Violation</option>
                    <option value="Other">Other</option>
                  </select>
                  {reportForm.formState.errors.reason && (
                    <p className="text-xs text-error mt-1.5 flex items-center gap-1">
                      <FiFlag className="w-3 h-3" /> {reportForm.formState.errors.reason.message}
                    </p>
                  )}
                </div>
                <div className="mb-5">
                  <label className="text-xs font-semibold mb-1.5 block text-base-content/70">Additional Details <span className="text-base-content/30">(optional)</span></label>
                  <textarea
                    {...reportForm.register('description')}
                    className="textarea textarea-bordered w-full rounded-xl text-sm bg-base-200/50 border-base-300/50 focus:border-primary/40"
                    rows={3}
                    placeholder="Provide more context..."
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <button type="button" onClick={() => setShowReportModal(false)} className="btn btn-ghost btn-sm rounded-xl text-base-content/50 hover:text-base-content">
                    Cancel
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-error to-rose-600 text-white text-xs font-semibold shadow-lg shadow-error/20"
                  >
                    <FiFlag className="w-3.5 h-3.5" /> Submit Report
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}

      <AITestModal
        isOpen={showAITest}
        onClose={() => setShowAITest(false)}
        promptContent={prompt.content}
        aiTool={prompt.aiTool}
      />
    </motion.div>
  );
}
