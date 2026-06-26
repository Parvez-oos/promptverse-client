'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiBookmark, FiTrash2, FiEye, FiBook } from 'react-icons/fi';
import { bookmarkService } from '@/services/bookmarkService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { CardSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SavedPromptsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['savedPrompts', page],
    queryFn: () => bookmarkService.getAll({ page: page.toString(), limit: '12' }),
  });

  const bookmarks = data?.data || [];
  const pagination = data?.pagination;

  const removeMutation = useMutation({
    mutationFn: (promptId: string) => bookmarkService.toggle(promptId),
    onSuccess: () => {
      toast.success('Bookmark removed');
      queryClient.invalidateQueries({ queryKey: ['savedPrompts'] });
    },
    onError: () => toast.error('Failed to remove bookmark'),
  });

  if (isLoading) return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
    </div>
  );
  if (isError) return <ErrorDisplay onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Saved Prompts</h1>
          <p className="text-sm text-base-content/50">
            {pagination ? `${pagination.total} bookmarked prompts` : 'Your bookmarked prompts'}
          </p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={<FiBookmark className="w-7 h-7 text-base-content/30" />}
          title="No saved prompts"
          description="Bookmark prompts you like to find them easily later."
          action={<Link href="/all-prompts" className="btn btn-primary btn-sm rounded-lg">Browse Prompts</Link>}
        />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {bookmarks.map((bookmark: any) => (
              <div key={bookmark._id} className="card bg-base-100 border border-base-300 p-5 hover:border-primary/20 transition-all">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{bookmark.prompt?.title}</h3>
                    <p className="text-xs text-base-content/50 mt-0.5">
                      {bookmark.prompt?.category} &middot; {bookmark.prompt?.aiTool}
                    </p>
                  </div>
                  <button
                    onClick={() => removeMutation.mutate(bookmark.prompt?._id)}
                    className="btn btn-ghost btn-xs btn-square text-error"
                    title="Remove bookmark"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-base-300/50">
                  <span className="text-xs text-base-content/40">{bookmark.prompt?.creator?.name}</span>
                  <Link
                    href={`/prompts/${bookmark.prompt?._id}`}
                    className="btn btn-primary btn-xs rounded-lg gap-1"
                  >
                    <FiEye className="w-3 h-3" /> View
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="btn btn-outline btn-sm rounded-lg"
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, pagination.pages) }).map((_, i) => {
                const pageNum = Math.max(1, Math.min(page - 2, pagination.pages - 4)) + i;
                if (pageNum > pagination.pages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`btn btn-sm rounded-lg ${pageNum === page ? 'btn-primary' : 'btn-ghost'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))}
                disabled={page >= pagination.pages}
                className="btn btn-outline btn-sm rounded-lg"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
}
