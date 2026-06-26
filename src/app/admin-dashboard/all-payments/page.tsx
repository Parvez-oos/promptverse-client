'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiCreditCard, FiSearch } from 'react-icons/fi';
import { paymentService } from '@/services/paymentService';
import { TableSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { formatDate } from '@/lib/utils';

export default function AllPaymentsPage() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminPayments', search, sort, page],
    queryFn: () => paymentService.getAll({
      ...(search && { search }),
      sort,
      page: page.toString(),
      limit: '15',
    }),
  });

  const payments = data?.data || [];
  const pagination = data?.pagination;

  if (isLoading) return <TableSkeleton rows={8} cols={5} />;
  if (isError) return <ErrorDisplay onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Payments</h1>
        <p className="text-sm text-base-content/50">
          {pagination ? `${pagination.total} total transactions` : `${payments.length} transactions`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-base-content/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-base-100 border border-base-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          />
        </div>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="select select-sm select-bordered rounded-xl text-sm min-w-[120px]"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="highest">Highest</option>
          <option value="lowest">Lowest</option>
        </select>
        <div className="ml-auto text-sm text-base-content/40">
          {pagination && `Page ${pagination.page} of ${pagination.pages}`}
        </div>
      </div>

      {payments.length === 0 ? (
        <EmptyState icon={<FiCreditCard className="w-7 h-7" />} title="No payments yet" />
      ) : (
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr className="text-xs text-base-content/50">
                <th>User</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Payment ID</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment: any) => (
                <tr key={payment._id} className="hover:bg-base-200/50">
                  <td className="text-sm font-medium">{payment.user?.name || 'N/A'}</td>
                  <td className="text-sm">{payment.email}</td>
                  <td className="text-sm font-semibold text-success">${payment.amount.toFixed(2)}</td>
                  <td className="text-xs text-base-content/50 font-mono">{payment.stripePaymentId?.slice(0, 20)}...</td>
                  <td className="text-xs text-base-content/50">{formatDate(payment.createdAt)}</td>
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
    </motion.div>
  );
}
