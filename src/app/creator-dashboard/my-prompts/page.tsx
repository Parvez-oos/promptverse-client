'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { FiEdit2, FiTrash2, FiBarChart2, FiEye, FiPlus, FiFileText, FiX, FiCopy, FiStar, FiCalendar, FiTag, FiActivity } from 'react-icons/fi';
import { dashboardService } from '@/services/dashboardService';
import { promptService } from '@/services/promptService';
import { TableSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import Link from 'next/link';
import { formatDate, formatNumber } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CreatorMyPromptsPage() {
  const queryClient = useQueryClient();
  const [analyticsPrompt, setAnalyticsPrompt] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['creatorMyPrompts', page, search],
    queryFn: () => dashboardService.getMyPrompts({
      ...(search && { search }),
      page: page.toString(),
      limit: '15',
    }),
  });

  const prompts = data?.data || [];
  const pagination = data?.pagination;

  const deleteMutation = useMutation({
    mutationFn: (id: string) => promptService.delete(id),
    onSuccess: () => {
      toast.success('Prompt deleted');
      queryClient.invalidateQueries({ queryKey: ['creatorMyPrompts'] });
    },
    onError: () => toast.error('Failed to delete prompt'),
  });

  const handleViewAnalytics = async (prompt: any) => {
    try {
      const res = await promptService.getById(prompt._id);
      setAnalyticsPrompt(res.data);
    } catch {
      setAnalyticsPrompt(prompt);
    }
  };

  if (isLoading) return <TableSkeleton rows={6} cols={7} />;
  if (isError) return <ErrorDisplay onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Prompts</h1>
          <p className="text-sm text-base-content/50">
            {pagination ? `${pagination.total} prompts` : 'Manage your prompt portfolio'}
          </p>
        </div>
        <Link href="/creator-dashboard/add-prompt" className="btn btn-primary btn-sm rounded-lg gap-1.5">
          <FiPlus className="w-4 h-4" /> Add Prompt
        </Link>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <input
          type="text"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search prompts..."
          className="input input-sm input-bordered rounded-xl w-full max-w-xs text-sm"
        />
        <div className="ml-auto text-sm text-base-content/40">
          {pagination && `Page ${pagination.page} of ${pagination.pages}`}
        </div>
      </div>

      {prompts.length === 0 ? (
        <EmptyState
          icon={<FiFileText className="w-7 h-7 text-base-content/30" />}
          title={search ? 'No prompts match your search' : 'No prompts yet'}
          description="Create your first prompt."
          action={<Link href="/creator-dashboard/add-prompt" className="btn btn-primary btn-sm rounded-lg">Create Prompt</Link>}
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-xs text-base-content/50">
                <th>Title</th>
                <th>Category</th>
                <th>Status</th>
                <th>Copies</th>
                <th>Visibility</th>
                <th>Date</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {prompts.map((prompt: any) => (
                <tr key={prompt._id} className="hover:bg-base-200/50">
                  <td className="font-medium text-sm">{prompt.title}</td>
                  <td><span className="badge badge-sm badge-ghost">{prompt.category}</span></td>
                  <td>
                    <span className={`badge badge-sm ${prompt.status === 'approved' ? 'badge-success' : prompt.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                      {prompt.status}
                    </span>
                  </td>
                  <td className="text-sm">{formatNumber(prompt.copyCount)}</td>
                  <td><span className={`badge badge-sm ${prompt.visibility === 'private' ? 'badge-accent' : 'badge-ghost'}`}>{prompt.visibility}</span></td>
                  <td className="text-xs text-base-content/50">{formatDate(prompt.createdAt)}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/prompts/${prompt._id}`} className="btn btn-ghost btn-xs btn-square" title="View">
                        <FiEye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleViewAnalytics(prompt)}
                        className="btn btn-ghost btn-xs btn-square text-primary"
                        title="View Analytics"
                      >
                        <FiBarChart2 className="w-4 h-4" />
                      </button>
                      <Link href={`/creator-dashboard/add-prompt?edit=${prompt._id}`} className="btn btn-ghost btn-xs btn-square" title="Edit">
                        <FiEdit2 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => { if (confirm('Delete this prompt?')) deleteMutation.mutate(prompt._id); }}
                        className="btn btn-ghost btn-xs btn-square text-error"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {pagination && pagination.pages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-6">
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
        </div>
      )}

      <AnimatePresence>
        {analyticsPrompt && (
          <AnalyticsModal prompt={analyticsPrompt} onClose={() => setAnalyticsPrompt(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function AnalyticsModal({ prompt, onClose }: { prompt: any; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-base-100 border border-base-300 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between p-6 border-b border-base-300">
          <h2 className="text-lg font-bold">Prompt Analytics</h2>
          <button onClick={onClose} className="btn btn-ghost btn-sm btn-square rounded-lg">
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-semibold text-sm mb-1">{prompt.title}</h3>
            <p className="text-xs text-base-content/50">{prompt.description?.slice(0, 100)}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-base-200/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FiCopy className="w-4 h-4 text-primary" />
                <span className="text-xs text-base-content/50">Total Copies</span>
              </div>
              <p className="text-2xl font-bold">{formatNumber(prompt.copyCount || 0)}</p>
            </div>
            <div className="p-4 bg-base-200/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FiStar className="w-4 h-4 text-warning" />
                <span className="text-xs text-base-content/50">Avg Rating</span>
              </div>
              <p className="text-2xl font-bold">
                {prompt.averageRating ? prompt.averageRating.toFixed(1) : '0.0'}
              </p>
            </div>
            <div className="p-4 bg-base-200/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FiActivity className="w-4 h-4 text-accent" />
                <span className="text-xs text-base-content/50">Status</span>
              </div>
              <span className={`badge ${
                prompt.status === 'approved' ? 'badge-success' :
                prompt.status === 'pending' ? 'badge-warning' :
                'badge-error'
              }`}>{prompt.status}</span>
            </div>
            <div className="p-4 bg-base-200/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FiCalendar className="w-4 h-4 text-secondary" />
                <span className="text-xs text-base-content/50">Created</span>
              </div>
              <p className="text-sm font-medium">{formatDate(prompt.createdAt)}</p>
            </div>
            <div className="p-4 bg-base-200/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FiTag className="w-4 h-4 text-info" />
                <span className="text-xs text-base-content/50">Category</span>
              </div>
              <p className="text-sm font-medium">{prompt.category}</p>
            </div>
            <div className="p-4 bg-base-200/50 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <FiBarChart2 className="w-4 h-4 text-success" />
                <span className="text-xs text-base-content/50">Reviews</span>
              </div>
              <p className="text-2xl font-bold">{prompt.reviewCount || 0}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
