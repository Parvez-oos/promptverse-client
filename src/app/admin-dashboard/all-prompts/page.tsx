'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiStar, FiTrash2, FiEye, FiSearch } from 'react-icons/fi';
import { adminService } from '@/services/adminService';
import { promptService } from '@/services/promptService';
import { TableSkeleton } from '@/components/ui/Skeleton';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function AllPromptsPage() {
  const [rejectModal, setRejectModal] = useState<{ id: string; open: boolean }>({ id: '', open: false });
  const [feedback, setFeedback] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('latest');
  const [page, setPage] = useState(1);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminAllPrompts', search, statusFilter, category, sort, page],
    queryFn: () => adminService.getAllPrompts({
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter }),
      ...(category && { category }),
      sort,
      page: page.toString(),
      limit: '15',
    }),
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['adminCategories'],
    queryFn: () => promptService.getCategories(),
  });

  const prompts = data?.data || [];
  const pagination = data?.pagination;
  const categories = categoriesData?.data || [];

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminService.approvePrompt(id),
    onSuccess: () => { toast.success('Prompt approved'); queryClient.invalidateQueries({ queryKey: ['adminAllPrompts'] }); },
    onError: () => toast.error('Failed to approve'),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, feedback }: { id: string; feedback: string }) => adminService.rejectPrompt(id, feedback),
    onSuccess: () => { toast.success('Prompt rejected'); setRejectModal({ id: '', open: false }); setFeedback(''); queryClient.invalidateQueries({ queryKey: ['adminAllPrompts'] }); },
    onError: () => toast.error('Failed to reject'),
  });

  const featureMutation = useMutation({
    mutationFn: (id: string) => adminService.toggleFeatured(id),
    onSuccess: () => { toast.success('Toggled featured'); queryClient.invalidateQueries({ queryKey: ['adminAllPrompts'] }); },
    onError: () => toast.error('Failed to toggle'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => promptService.delete(id),
    onSuccess: () => { toast.success('Prompt deleted'); queryClient.invalidateQueries({ queryKey: ['adminAllPrompts'] }); },
    onError: () => toast.error('Failed to delete'),
  });

  const clearFilters = () => {
    setSearch('');
    setStatusFilter('');
    setCategory('');
    setSort('latest');
    setPage(1);
  };

  const hasFilters = search || statusFilter || category;

  if (isLoading) return <TableSkeleton rows={8} cols={8} />;
  if (isError) return <ErrorDisplay onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Prompts</h1>
        <p className="text-sm text-base-content/50">
          {pagination ? `${pagination.total} total prompts` : `${prompts.length} prompts`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-base-content/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search prompts..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-base-100 border border-base-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="select select-sm select-bordered rounded-xl text-sm min-w-[120px]"
        >
          <option value="">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={category}
          onChange={(e) => { setCategory(e.target.value); setPage(1); }}
          className="select select-sm select-bordered rounded-xl text-sm min-w-[140px]"
        >
          <option value="">All Categories</option>
          {categories.map((cat: string) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="select select-sm select-bordered rounded-xl text-sm min-w-[120px]"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="most_copied">Most Copied</option>
          <option value="title_asc">Title A-Z</option>
          <option value="title_desc">Title Z-A</option>
        </select>

        {hasFilters && (
          <button onClick={clearFilters} className="btn btn-ghost btn-sm rounded-xl gap-1 text-error">
            <FiX className="w-4 h-4" /> Clear
          </button>
        )}

        <div className="ml-auto text-sm text-base-content/40">
          {pagination && `Page ${pagination.page} of ${pagination.pages}`}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table">
          <thead>
            <tr className="text-xs text-base-content/50">
              <th>Title</th>
              <th>Creator</th>
              <th>Category</th>
              <th>Status</th>
              <th>Featured</th>
              <th>Copies</th>
              <th>Date</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {prompts.map((prompt: any) => (
              <tr key={prompt._id} className="hover:bg-base-200/50">
                <td className="text-sm font-medium max-w-[200px] truncate">{prompt.title}</td>
                <td className="text-sm">{prompt.creator?.name || 'Unknown'}</td>
                <td><span className="badge badge-sm badge-ghost">{prompt.category}</span></td>
                <td>
                  <span className={`badge badge-sm ${prompt.status === 'approved' ? 'badge-success' : prompt.status === 'pending' ? 'badge-warning' : 'badge-error'}`}>
                    {prompt.status}
                  </span>
                </td>
                <td>
                  {prompt.isFeatured ? (
                    <span className="badge badge-sm badge-accent">Featured</span>
                  ) : (
                    <span className="badge badge-sm badge-ghost">No</span>
                  )}
                </td>
                <td className="text-sm">{prompt.copyCount}</td>
                <td className="text-xs text-base-content/50">{formatDate(prompt.createdAt)}</td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/prompts/${prompt._id}`} className="btn btn-ghost btn-xs btn-square"><FiEye className="w-3.5 h-3.5" /></Link>
                    {prompt.status === 'pending' && (
                      <>
                        <button onClick={() => approveMutation.mutate(prompt._id)} className="btn btn-ghost btn-xs btn-square text-success" title="Approve"><FiCheck className="w-3.5 h-3.5" /></button>
                        <button onClick={() => setRejectModal({ id: prompt._id, open: true })} className="btn btn-ghost btn-xs btn-square text-error" title="Reject"><FiX className="w-3.5 h-3.5" /></button>
                      </>
                    )}
                    <button onClick={() => featureMutation.mutate(prompt._id)} className={`btn btn-ghost btn-xs btn-square ${prompt.isFeatured ? 'text-accent' : ''}`} title="Toggle featured"><FiStar className="w-3.5 h-3.5" /></button>
                    <button onClick={() => { if (confirm('Delete this prompt?')) deleteMutation.mutate(prompt._id); }} className="btn btn-ghost btn-xs btn-square text-error"><FiTrash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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

      {rejectModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setRejectModal({ id: '', open: false })}>
          <div className="bg-base-100 rounded-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-3">Reject Prompt</h3>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Provide rejection feedback..."
              className="textarea textarea-bordered w-full rounded-xl text-sm mb-4"
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <button onClick={() => setRejectModal({ id: '', open: false })} className="btn btn-ghost btn-sm rounded-lg">Cancel</button>
              <button onClick={() => rejectMutation.mutate({ id: rejectModal.id, feedback })} disabled={!feedback} className="btn btn-error btn-sm rounded-lg">Reject</button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
