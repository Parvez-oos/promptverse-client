'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiFileText, FiBookmark, FiStar, FiCopy, FiPlusCircle,
  FiTrendingUp, FiClock, FiArrowUpRight, FiActivity,
  FiBarChart2, FiChevronRight, FiZap, FiGrid, FiSearch,
  FiArrowUp, FiArrowDown,
} from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area,
} from 'recharts';
import { useAuth } from '@/providers/AuthProvider';
import { formatNumber } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

const activityData = [
  { name: 'Mon', prompts: 4, saves: 2, views: 28 },
  { name: 'Tue', prompts: 7, saves: 5, views: 45 },
  { name: 'Wed', prompts: 3, saves: 8, views: 52 },
  { name: 'Thu', prompts: 9, saves: 3, views: 38 },
  { name: 'Fri', prompts: 5, saves: 7, views: 61 },
  { name: 'Sat', prompts: 2, saves: 4, views: 22 },
  { name: 'Sun', prompts: 6, saves: 6, views: 47 },
];

const categoryData = [
  { name: 'ChatGPT', value: 42 },
  { name: 'Midjourney', value: 28 },
  { name: 'Claude', value: 18 },
  { name: 'Gemini', value: 12 },
];

const recentActivity = [
  { action: 'Created prompt', detail: 'Advanced React Patterns', time: '2 hours ago', type: 'create' },
  { action: 'Saved prompt', detail: 'Python Data Analysis', time: '4 hours ago', type: 'save' },
  { action: 'Left a review', detail: '5 stars on "SEO Mastery"', time: '6 hours ago', type: 'review' },
  { action: 'Copied prompt', detail: 'Content Marketing Blueprint', time: '1 day ago', type: 'copy' },
  { action: 'Bookmarked', detail: 'UI/UX Design System', time: '2 days ago', type: 'bookmark' },
];

const quickActions = [
  { label: 'New Prompt', href: '/dashboard/add-prompt', icon: FiPlusCircle, color: 'from-primary to-secondary' },
  { label: 'My Prompts', href: '/dashboard/my-prompts', icon: FiFileText, color: 'from-accent to-warning' },
  { label: 'Saved', href: '/dashboard/saved-prompts', icon: FiBookmark, color: 'from-secondary to-accent' },
  { label: 'Reviews', href: '/dashboard/my-reviews', icon: FiStar, color: 'from-warning to-error' },
];

const statsCards = [
  { label: 'My Prompts', value: 0, icon: FiFileText, color: 'from-primary to-secondary', change: '+3 this week', trend: 'up' as const },
  { label: 'Saved Prompts', value: 0, icon: FiBookmark, color: 'from-secondary to-accent', change: '+12 this week', trend: 'up' as const },
  { label: 'Reviews', value: 0, icon: FiStar, color: 'from-warning to-error', change: '+5 this week', trend: 'up' as const },
  { label: 'Copies', value: 0, icon: FiCopy, color: 'from-accent to-warning', change: '+28 this week', trend: 'up' as const },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  const statValue = (label: string) => {
    if (label === 'My Prompts') return user?.totalPrompts || 0;
    return Math.floor(Math.random() * 50) + 5;
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Welcome back, {user?.name?.split(' ')[0] || 'there'}
            <span className="ml-1.5 inline-block">👋</span>
          </h1>
          <p className="text-sm text-base-content/50 mt-1">
            Here&apos;s what&apos;s happening with your prompts today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="join bg-base-100 border border-base-300 rounded-xl p-0.5">
            {(['week', 'month', 'year'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`join-item px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  timeRange === r
                    ? 'bg-primary text-primary-content shadow-sm'
                    : 'text-base-content/50 hover:text-base-content'
                }`}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            ))}
          </div>
          <Link
            href="/dashboard/add-prompt"
            className="btn btn-primary btn-sm rounded-xl gap-1.5"
          >
            <FiPlusCircle className="w-4 h-4" />
            <span className="hidden sm:inline">New Prompt</span>
          </Link>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
      >
        {statsCards.map((card) => (
          <div
            key={card.label}
            className="card bg-base-100 border border-base-300 p-4 sm:p-5 card-hover group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}>
                <card.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-[10px] sm:text-xs text-success font-medium bg-success/10 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                <FiArrowUp className="w-3 h-3" />
                {card.change}
              </span>
            </div>
            <p className="text-xl sm:text-2xl font-bold tracking-tight">{formatNumber(statValue(card.label))}</p>
            <p className="text-xs sm:text-sm text-base-content/50 mt-0.5">{card.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        {/* Activity Chart */}
        <div className="card bg-base-100 border border-base-300 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FiActivity className="w-3.5 h-3.5 text-primary" />
                </div>
                Activity Overview
              </h3>
              <p className="text-[11px] text-base-content/40 mt-1 ml-9">Prompt views & engagement</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-success font-medium bg-success/10 px-2 py-1 rounded-lg">
              <FiTrendingUp className="w-3 h-3" />
              +12%
            </div>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" strokeOpacity={0.5} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-base-content)" strokeOpacity={0.3} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-base-content)" strokeOpacity={0.3} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-base-100)',
                    border: '1px solid var(--color-base-300)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="views" stroke="var(--color-primary)" strokeWidth={2} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="card bg-base-100 border border-base-300 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <FiBarChart2 className="w-3.5 h-3.5 text-secondary" />
                </div>
                Tool Distribution
              </h3>
              <p className="text-[11px] text-base-content/40 mt-1 ml-9">Prompts by AI tool</p>
            </div>
          </div>
          <div className="h-56 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" strokeOpacity={0.5} horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-base-content)" strokeOpacity={0.3} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="var(--color-base-content)" strokeOpacity={0.3} axisLine={false} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--color-base-100)',
                    border: '1px solid var(--color-base-300)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={20}>
                  {categoryData.map((_, index) => (
                    <rect key={index} fill={`hsl(${260 + index * 30}, 70%, 55%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-base-300/60">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-1.5 text-xs text-base-content/60">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: `hsl(${260 + categoryData.indexOf(cat) * 30}, 70%, 55%)` }}
                />
                {cat.name}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Bottom Row: Recent Activity + Quick Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 card bg-base-100 border border-base-300 p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-accent/10 flex items-center justify-center">
                  <FiClock className="w-3.5 h-3.5 text-accent" />
                </div>
                Recent Activity
              </h3>
              <p className="text-[11px] text-base-content/40 mt-1 ml-9">Your latest interactions</p>
            </div>
            <Link
              href="/dashboard/my-prompts"
              className="text-xs text-primary hover:text-primary/70 font-medium flex items-center gap-1 transition-colors"
            >
              View all <FiChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-0">
            {recentActivity.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 border-b border-base-300/40 last:border-0 group"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200 ${
                  item.type === 'create' ? 'bg-primary/10 text-primary' :
                  item.type === 'save' ? 'bg-secondary/10 text-secondary' :
                  item.type === 'review' ? 'bg-accent/10 text-accent' :
                  item.type === 'copy' ? 'bg-success/10 text-success' :
                  'bg-warning/10 text-warning'
                }`}>
                  {item.type === 'create' ? <FiPlusCircle className="w-3.5 h-3.5" /> :
                   item.type === 'save' ? <FiBookmark className="w-3.5 h-3.5" /> :
                   item.type === 'review' ? <FiStar className="w-3.5 h-3.5" /> :
                   item.type === 'copy' ? <FiCopy className="w-3.5 h-3.5" /> :
                   <FiBookmark className="w-3.5 h-3.5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-base-content/80">{item.action}</p>
                  <p className="text-xs text-base-content/40 mt-0.5 truncate">{item.detail}</p>
                </div>
                <span className="text-[11px] text-base-content/30 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Profile Card */}
        <div className="space-y-4 sm:space-y-6">
          {/* Mini Profile Card */}
          <div className="card bg-base-100 border border-base-300 p-5 card-hover">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg overflow-hidden shrink-0 shadow-sm ring-2 ring-base-100">
                {user?.photoURL ? (
                  <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.charAt(0)?.toUpperCase() || 'U'
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
                <p className="text-xs text-base-content/40 truncate">{user?.email || ''}</p>
              </div>
              <Link
                href="/dashboard/profile"
                className="btn btn-ghost btn-xs btn-square rounded-lg ml-auto shrink-0"
              >
                <FiArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge badge-sm capitalize bg-base-200 text-base-content/60 border-0">{user?.role || 'user'}</span>
              {user?.isPremium ? (
                <span className="badge badge-sm gap-1 bg-accent/10 text-accent border-0">
                  <FiZap className="w-3 h-3" /> Premium
                </span>
              ) : (
                <Link href="/payment" className="badge badge-sm gap-1 hover:bg-primary/10 hover:text-primary border-0 cursor-pointer transition-colors">
                  Upgrade
                </Link>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card bg-base-100 border border-base-300 p-5">
            <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-warning/10 flex items-center justify-center">
                <FiZap className="w-3.5 h-3.5 text-warning" />
              </div>
              Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-base-200/50 hover:bg-base-200 transition-all duration-200 group"
                >
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${action.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200`}>
                    <action.icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[11px] font-medium text-base-content/60 group-hover:text-base-content/80 transition-colors">
                    {action.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
