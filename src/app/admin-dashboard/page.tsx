'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FiUsers, FiFileText, FiStar, FiCopy, FiCreditCard, FiFlag, FiBookmark, FiAlertTriangle,
  FiBarChart2,
} from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { adminService } from '@/services/adminService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { formatNumber } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['adminAnalytics'],
    queryFn: () => adminService.getAnalytics(),
  });

  const analytics = data?.data;

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (isError) return <ErrorDisplay onRetry={refetch} />;

  const statsCards = [
    { icon: FiUsers, label: 'Total Users', value: formatNumber(analytics?.totalUsers || 0), color: 'from-primary to-secondary' },
    { icon: FiFileText, label: 'Total Prompts', value: formatNumber(analytics?.totalPrompts || 0), color: 'from-accent to-warning' },
    { icon: FiStar, label: 'Total Reviews', value: formatNumber(analytics?.totalReviews || 0), color: 'from-warning to-error' },
    { icon: FiCopy, label: 'Total Copies', value: formatNumber(analytics?.totalCopies || 0), color: 'from-secondary to-accent' },
    { icon: FiCreditCard, label: 'Revenue', value: `$${formatNumber(analytics?.totalRevenue || 0)}`, color: 'from-success to-primary' },
    { icon: FiFlag, label: 'Pending Reports', value: formatNumber(analytics?.totalReports || 0), color: 'from-error to-warning' },
    { icon: FiBookmark, label: 'Total Bookmarks', value: formatNumber(analytics?.totalBookmarks || 0), color: 'from-primary to-accent' },
    { icon: FiAlertTriangle, label: 'Pending Prompts', value: formatNumber(analytics?.pendingPrompts || 0), color: 'from-warning to-error' },
  ];

  const chartData = analytics?.monthlyData?.map((d: any) => ({
    name: `${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][d._id.month - 1]}`,
    Prompts: d.count,
    Copies: d.copies,
  })) || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-sm text-base-content/50 mt-1">Platform overview and analytics</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        {statsCards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card bg-base-100 border border-base-300 p-4 card-hover"
          >
            <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-2 shadow-sm`}>
              <card.icon className="w-4 h-4 text-white" />
            </div>
            <p className="text-xl font-bold tracking-tight">{card.value}</p>
            <p className="text-xs text-base-content/50 mt-0.5">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="card bg-base-100 border border-base-300 p-5 sm:p-6">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
              <FiFileText className="w-3.5 h-3.5 text-primary" />
            </div>
            Prompt Growth
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--base-300)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--base-content)" opacity={0.5} />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--base-content)" opacity={0.5} />
                <Tooltip contentStyle={{ background: 'var(--base-100)', border: '1px solid var(--base-300)', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="Prompts" stroke="#7C3AED" strokeWidth={2} />
                <Line type="monotone" dataKey="Copies" stroke="#06B6D4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-base-content/30 text-sm">No data yet</div>
          )}
        </div>
        <div className="card bg-base-100 border border-base-300 p-5 sm:p-6">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
              <FiBarChart2 className="w-3.5 h-3.5 text-secondary" />
            </div>
            Monthly Distribution
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--base-300)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--base-content)" opacity={0.5} />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--base-content)" opacity={0.5} />
                <Tooltip contentStyle={{ background: 'var(--base-100)', border: '1px solid var(--base-300)', borderRadius: '12px' }} />
                <Bar dataKey="Prompts" fill="#7C3AED" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-base-content/30 text-sm">No data yet</div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
