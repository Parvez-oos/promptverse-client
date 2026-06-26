'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiFlag, FiCheck, FiX, FiTrash2, FiAlertTriangle, FiSearch } from 'react-icons/fi';
import { reportService } from '@/services/reportService';
import { promptService } from '@/services/promptService';
import { ListSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function ReportedPromptsPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminReports', search, page],
    queryFn: () => reportService.getAll({
      status: 'pending',
      ...(search && { search }),
      page: page.toString(),
      limit: '10',
    }),
  });

  const reports = data?.data || [];
  const pagination = data?.pagination;

  const dismissMutation = useMutation({
    mutationFn: (id: string) => reportService.updateStatus(id, 'dismissed'),
    onSuccess: () => { toast.success('Report dismissed'); queryClient.invalidateQueries({ queryKey: ['adminReports'] }); },
    onError: () => toast.error('Failed to dismiss'),
  });

  const actionTakenMutation = useMutation({
    mutationFn: (id: string) => reportService.updateStatus(id, 'action_taken'),
    onSuccess: () => { toast.success('Action taken'); queryClient.invalidateQueries({ queryKey: ['adminReports'] }); },
    onError: () => toast.error('Failed to update'),
  });

  const deletePromptMutation = useMutation({
    mutationFn: (id: string) => promptService.delete(id),
    onSuccess: () => { toast.success('Prompt removed'); queryClient.invalidateQueries({ queryKey: ['adminReports'] }); },
    onError: () => toast.error('Failed to delete prompt'),
  });

  if (isLoading) return <ListSkeleton count={5} />;
  if (isError) return <ErrorDisplay onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reported Prompts</h1>
        <p className="text-sm text-base-content/50">
          {pagination ? `${pagination.total} pending reports` : `${reports.length} reports`}
        </p>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-base-content/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search reports..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-base-100 border border-base-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          />
        </div>
        <div className="ml-auto text-sm text-base-content/40">
          {pagination && `Page ${pagination.page} of ${pagination.pages}`}
        </div>
      </div>

      {reports.length === 0 ? (
        <EmptyState icon={<FiFlag className="w-7 h-7" />} title="No pending reports" description="All clear! No reported prompts." />
      ) : (
        <>
          <div className="space-y-4">
            {reports.map((report: any) => (
              <div key={report._id} className="card bg-base-100 border border-base-300 p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <FiAlertTriangle className="w-4 h-4 text-error" />
                      <h3 className="font-semibold text-sm">{report.prompt?.title || 'Deleted Prompt'}</h3>
                    </div>
                    <p className="text-xs text-base-content/50">
                      Reported by {report.user?.name || 'Unknown'} &middot; {formatDate(report.createdAt)}
                    </p>
                  </div>
                  <span className="badge badge-sm badge-error">{report.reason}</span>
                </div>

                {report.description && (
                  <p className="text-sm text-base-content/60 mb-3 p-3 bg-base-200/50 rounded-lg">{report.description}</p>
                )}

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-base-300/50">
                  <button onClick={() => dismissMutation.mutate(report._id)} className="btn btn-ghost btn-xs rounded-lg gap-1">
                    <FiX className="w-3.5 h-3.5" /> Dismiss
                  </button>
                  <button onClick={() => actionTakenMutation.mutate(report._id)} className="btn btn-warning btn-xs rounded-lg gap-1">
                    <FiAlertTriangle className="w-3.5 h-3.5" /> Warn Creator
                  </button>
                  <button
                    onClick={() => { if (confirm('Remove this prompt?')) deletePromptMutation.mutate(report.prompt?._id); }}
                    className="btn btn-error btn-xs rounded-lg gap-1"
                  >
                    <FiTrash2 className="w-3.5 h-3.5" /> Remove Prompt
                  </button>
                </div>
              </div>
            ))}
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
        </>
      )}
    </motion.div>
  );
}
