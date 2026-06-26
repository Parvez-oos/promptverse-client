'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi';
import { promptService } from '@/services/promptService';
import PromptCard from '@/components/prompts/PromptCard';
import { CardSkeleton } from '@/components/ui/Skeleton';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import EmptyState from '@/components/ui/EmptyState';

const ITEMS_PER_PAGE = 16;

function AllPromptsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState('');
  const [aiTool, setAiTool] = useState('');
  const [difficulty, setDifficulty] = useState('');
  const [sort, setSort] = useState('trending');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['allPrompts', search, category, aiTool, difficulty, sort, page],
    queryFn: () =>
      promptService.getAll({
        ...(search && { search }),
        ...(category && { category }),
        ...(aiTool && { aiTool }),
        ...(difficulty && { difficultyLevel: difficulty }),
        sort,
        page: page.toString(),
        limit: ITEMS_PER_PAGE.toString(),
      }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => promptService.getCategories(),
  });

  const { data: aiToolsData } = useQuery({
    queryKey: ['aiTools'],
    queryFn: () => promptService.getAITools(),
  });

  const prompts = data?.data || [];
  const pagination = data?.pagination;
  const categories = categoriesData?.data || [];
  const aiTools = aiToolsData?.data || [];
  const totalPages = pagination?.pages || 0;

  useEffect(() => {
    const searchVal = searchParams.get('search');
    if (searchVal) {
      setSearch(searchVal);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const clearFilters = () => {
    setSearch('');
    setCategory('');
    setAiTool('');
    setDifficulty('');
    setSort('trending');
    setPage(1);
  };

  const hasFilters = search || category || aiTool || difficulty;

  const handleFilterChange = (setter: (val: string) => void, value: string) => {
    setter(value);
    setPage(1);
  };

  const goToPage = (p: number) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      let start = Math.max(2, page - 1);
      let end = Math.min(totalPages - 1, page + 1);
      if (page <= 3) { start = 2; end = Math.min(5, totalPages - 1); }
      if (page >= totalPages - 2) { start = Math.max(totalPages - 4, 2); end = totalPages - 1; }
      if (start > 2) pages.push('...');
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.06 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, damping: 20, stiffness: 200 } },
  };

  return (
    <div className="min-h-screen">
      <div className="bg-base-200/50 border-b border-base-300/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">
              Explore <span className="gradient-text">Prompts</span>
            </h1>
            <p className="text-base-content/60 text-sm">
              Discover thousands of AI prompts for every tool and use case.
            </p>
          </motion.div>

          <form onSubmit={handleSearch} className="mt-6">
            <div className="relative max-w-2xl">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search prompts by title, tags, or AI tool..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-base-100 border border-base-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-sm transition-all"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select
            value={category}
            onChange={(e) => handleFilterChange(setCategory, e.target.value)}
            className="select select-sm select-bordered rounded-xl text-sm min-w-[140px]"
          >
            <option value="">All Categories</option>
            {categories.map((cat: string) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <select
            value={aiTool}
            onChange={(e) => handleFilterChange(setAiTool, e.target.value)}
            className="select select-sm select-bordered rounded-xl text-sm min-w-[140px]"
          >
            <option value="">All AI Tools</option>
            {aiTools.map((tool: string) => (
              <option key={tool} value={tool}>{tool}</option>
            ))}
          </select>

          <select
            value={difficulty}
            onChange={(e) => handleFilterChange(setDifficulty, e.target.value)}
            className="select select-sm select-bordered rounded-xl text-sm min-w-[130px]"
          >
            <option value="">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Pro">Pro</option>
          </select>

          <select
            value={sort}
            onChange={(e) => handleFilterChange(setSort, e.target.value)}
            className="select select-sm select-bordered rounded-xl text-sm min-w-[130px]"
          >
            <option value="trending">Trending</option>
            <option value="latest">Latest</option>
            <option value="popular">Most Popular</option>
            <option value="most_copied">Most Copied</option>
          </select>

          {hasFilters && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={clearFilters}
              className="btn btn-ghost btn-sm rounded-xl gap-1.5 text-error"
            >
              <FiX className="w-4 h-4" /> Clear
            </motion.button>
          )}

          <div className="ml-auto text-sm text-base-content/40">
            {pagination && `Page ${page} of ${totalPages} (${pagination.total} prompts)`}
          </div>
        </div>

        {isLoading && page === 1 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {Array.from({ length: 6 }).map((_, i) => (
              <motion.div key={i} variants={itemVariants}>
                <CardSkeleton />
              </motion.div>
            ))}
          </motion.div>
        ) : isError ? (
          <ErrorDisplay message="Failed to load prompts." onRetry={refetch} />
        ) : prompts.length === 0 ? (
          <EmptyState
            title="No prompts found"
            description="Try adjusting your search or filter criteria."
          />
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <AnimatePresence mode="popLayout">
                {prompts.map((prompt: any) => (
                  <motion.div
                    key={prompt._id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 200 }}
                  >
                    <PromptCard prompt={prompt} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {isFetching && page > 1 && (
              <div className="flex justify-center py-8">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
                />
              </div>
            )}

            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => goToPage(1)}
                  disabled={page <= 1}
                  className="btn btn-ghost btn-sm rounded-lg"
                  title="First page"
                >
                  <FiChevronsLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1}
                  className="btn btn-outline btn-sm rounded-lg gap-1"
                >
                  <FiChevronLeft className="w-4 h-4" /> Previous
                </button>
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((p, i) =>
                    typeof p === 'string' ? (
                      <span key={`ellipsis-${i}`} className="px-1 text-sm text-base-content/40">...</span>
                    ) : (
                      <button
                        key={p}
                        onClick={() => goToPage(p)}
                        className={`btn btn-sm rounded-lg min-w-[40px] ${
                          p === page ? 'btn-primary' : 'btn-ghost'
                        }`}
                      >
                        {p}
                      </button>
                    )
                  )}
                </div>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages}
                  className="btn btn-outline btn-sm rounded-lg gap-1"
                >
                  Next <FiChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => goToPage(totalPages)}
                  disabled={page >= totalPages}
                  className="btn btn-ghost btn-sm rounded-lg"
                  title="Last page"
                >
                  <FiChevronsRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function AllPromptsPage() {
  return (
    <Suspense fallback={
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.06 } },
        }}
        className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
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
    }>
      <AllPromptsContent />
    </Suspense>
  );
}
