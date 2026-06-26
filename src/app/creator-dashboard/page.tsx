'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  FiFileText, FiCopy, FiBookmark, FiStar, FiTrendingUp, FiTrendingDown,
} from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend,
} from 'recharts';
import { dashboardService } from '@/services/dashboardService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { formatNumber } from '@/lib/utils';

export default function CreatorDashboardHome() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['creatorAnalytics'],
    queryFn: () => dashboardService.getCreatorAnalytics(),
  });

  const analytics = data?.data;

  if (isLoading) return <LoadingSpinner size="lg" />;
  if (isError) return <ErrorDisplay onRetry={refetch} />;

  const statsCards = [
    { icon: FiFileText, label: 'Total Prompts', value: analytics?.totalPrompts || 0, color: 'from-primary to-secondary' },
    { icon: FiCopy, label: 'Total Copies', value: formatNumber(analytics?.totalCopies || 0), color: 'from-accent to-warning' },
    { icon: FiBookmark, label: 'Total Bookmarks', value: formatNumber(analytics?.totalBookmarks || 0), color: 'from-secondary to-accent' },
    { icon: FiStar, label: 'Total Reviews', value: formatNumber(analytics?.totalReviews || 0), color: 'from-warning to-error' },
  ];

  const chartData = analytics?.monthlyData?.map((d: any) => ({
    name: `${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][d._id.month - 1]} ${d._id.year}`,
    Prompts: d.count,
    Copies: d.copies,
  })) || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Creator Analytics</h1>
        <p className="text-sm text-base-content/50">Track your prompt performance and growth</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statsCards.map((card, index) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card bg-base-100 border border-base-300 p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                <card.icon className="w-5 h-5 text-white" />
              </div>
              <card.icon className="w-4 h-4 text-base-content/20" />
            </div>
            <p className="text-2xl font-bold">{card.value}</p>
            <p className="text-xs text-base-content/50 mt-1">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card bg-base-100 border border-base-300 p-6">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <FiTrendingUp className="w-4 h-4 text-primary" /> Total Copies
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--base-300)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--base-content)" opacity={0.5} />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--base-content)" opacity={0.5} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--base-100)',
                    border: '1px solid var(--base-300)',
                    borderRadius: '12px',
                  }}
                />
                <Line type="monotone" dataKey="Copies" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-base-content/30 text-sm">No data yet</div>
          )}
        </div>

        <div className="card bg-base-100 border border-base-300 p-6">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <FiTrendingUp className="w-4 h-4 text-secondary" /> Prompt Growth
          </h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--base-300)" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--base-content)" opacity={0.5} />
                <YAxis tick={{ fontSize: 12 }} stroke="var(--base-content)" opacity={0.5} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--base-100)',
                    border: '1px solid var(--base-300)',
                    borderRadius: '12px',
                  }}
                />
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
