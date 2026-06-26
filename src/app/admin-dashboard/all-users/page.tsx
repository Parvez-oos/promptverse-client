'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiTrash2, FiSearch, FiX } from 'react-icons/fi';
import { userService } from '@/services/userService';
import { TableSkeleton } from '@/components/ui/Skeleton';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AllUsersPage() {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [premiumFilter, setPremiumFilter] = useState('');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminAllUsers', search, roleFilter, premiumFilter, sort, page],
    queryFn: () => userService.getAll({
      ...(search && { search }),
      ...(roleFilter && { role: roleFilter }),
      ...(premiumFilter !== '' && { isPremium: premiumFilter }),
      sort,
      page: page.toString(),
      limit: '15',
    }),
  });

  const users = data?.data || [];
  const pagination = data?.pagination;

  const roleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => userService.updateRole(userId, role),
    onSuccess: () => {
      toast.success('Role updated');
      queryClient.invalidateQueries({ queryKey: ['adminAllUsers'] });
    },
    onError: () => toast.error('Failed to update role'),
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: string) => userService.delete(userId),
    onSuccess: () => {
      toast.success('User deleted');
      queryClient.invalidateQueries({ queryKey: ['adminAllUsers'] });
    },
    onError: () => toast.error('Failed to delete user'),
  });

  const clearFilters = () => {
    setSearch('');
    setRoleFilter('');
    setPremiumFilter('');
    setSort('newest');
    setPage(1);
  };

  const hasFilters = search || roleFilter || premiumFilter !== '';

  if (isLoading) return <TableSkeleton rows={8} cols={7} />;
  if (isError) return <ErrorDisplay onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>
        <p className="text-sm text-base-content/50">
          {pagination ? `${pagination.total} total users` : `${users.length} users`}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-base-content/40" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-base-100 border border-base-300 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 outline-none text-sm"
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="select select-sm select-bordered rounded-xl text-sm min-w-[120px]"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="creator">Creator</option>
          <option value="admin">Admin</option>
        </select>

        <select
          value={premiumFilter}
          onChange={(e) => { setPremiumFilter(e.target.value); setPage(1); }}
          className="select select-sm select-bordered rounded-xl text-sm min-w-[120px]"
        >
          <option value="">All Status</option>
          <option value="true">Premium</option>
          <option value="false">Free</option>
        </select>

        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="select select-sm select-bordered rounded-xl text-sm min-w-[120px]"
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
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
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Premium</th>
              <th>Prompts</th>
              <th>Joined</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user: any) => (
              <tr key={user._id} className="hover:bg-base-200/50">
                <td>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary overflow-hidden">
                      {user.photoURL ? <img src={user.photoURL} alt="" className="w-full h-full object-cover" /> : user.name?.charAt(0)?.toUpperCase()}
                    </div>
                    <span className="text-sm font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="text-sm">{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => roleMutation.mutate({ userId: user._id, role: e.target.value })}
                    className="select select-xs select-bordered rounded-lg"
                  >
                    <option value="user">User</option>
                    <option value="creator">Creator</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  {user.isPremium ? (
                    <span className="badge badge-sm badge-accent">Premium</span>
                  ) : (
                    <span className="badge badge-sm badge-ghost">Free</span>
                  )}
                </td>
                <td className="text-sm">{user.totalPrompts || 0}</td>
                <td className="text-xs text-base-content/50">{formatDate(user.createdAt)}</td>
                <td className="text-right">
                  <button
                    onClick={() => { if (confirm('Delete this user and all their data?')) deleteMutation.mutate(user._id); }}
                    className="btn btn-ghost btn-xs btn-square text-error"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
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
    </motion.div>
  );
}
