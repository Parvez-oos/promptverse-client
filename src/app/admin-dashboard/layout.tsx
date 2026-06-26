'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUsers, FiFileText, FiCreditCard, FiFlag, FiBarChart2,
  FiLogOut, FiMenu, FiX, FiSun, FiMoon, FiArrowLeft,
} from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/hooks/useTheme';

const sidebarLinks = [
  { href: '/admin-dashboard', label: 'Analytics', icon: FiBarChart2 },
  { href: '/admin-dashboard/all-users', label: 'All Users', icon: FiUsers },
  { href: '/admin-dashboard/all-prompts', label: 'All Prompts', icon: FiFileText },
  { href: '/admin-dashboard/all-payments', label: 'Payments', icon: FiCreditCard },
  { href: '/admin-dashboard/reported-prompts', label: 'Reports', icon: FiFlag },
];

export default function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useAuth();
  const { toggleTheme, isDark } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200/30">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-base-300 border-t-primary animate-spin" />
          <span className="text-sm text-base-content/50">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    router.replace('/login');
    return null;
  }

  if (user.role !== 'admin') {
    router.replace('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-base-200/30">
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-base-300/50 h-16 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">PV</span>
          </div>
          <span className="font-bold text-sm tracking-tight">Admin</span>
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleTheme} className="btn btn-ghost btn-sm btn-square rounded-xl">
            {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
          </button>
          <button onClick={() => setSidebarOpen(true)} className="btn btn-ghost btn-sm btn-square rounded-xl">
            <FiMenu className="w-5 h-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-72 h-full bg-base-100 border-r border-base-300 flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-5 border-b border-base-300">
                <div className="flex items-center justify-between">
                  <span className="font-bold">Admin Panel</span>
                  <button onClick={() => setSidebarOpen(false)} className="btn btn-ghost btn-sm btn-square rounded-xl">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <AdminSidebarContent pathname={pathname} logout={logout} />
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-base-100 border-r border-base-300 flex-col z-40">
        <div className="p-5 border-b border-base-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-error to-warning flex items-center justify-center shadow-sm">
                <FiBarChart2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight block leading-none">Admin</span>
                <span className="text-[10px] text-base-content/40 font-medium uppercase tracking-wider">Dashboard</span>
              </div>
            </div>
            <Link href="/dashboard/profile" className="btn btn-ghost btn-xs rounded-xl gap-1">
              <FiArrowLeft className="w-3 h-3" /> Main
            </Link>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          <AdminSidebarContent pathname={pathname} logout={logout} />
        </div>
        <div className="p-3 border-t border-base-300 space-y-1">
          <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/55 hover:text-base-content hover:bg-base-200/60 w-full transition-all">
            {isDark ? <FiSun className="w-[18px] h-[18px]" /> : <FiMoon className="w-[18px] h-[18px]" />}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </button>
        </div>
      </aside>

      <div className="lg:ml-64 min-h-screen">
        <div className="h-16 lg:hidden" />
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">{children}</div>
      </div>
    </div>
  );
}

function AdminSidebarContent({ pathname, logout }: { pathname: string; logout: () => void }) {
  return (
    <nav className="space-y-1">
      <p className="text-[10px] font-semibold text-base-content/30 uppercase tracking-wider px-3 mb-2">Management</p>
      {sidebarLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            pathname === link.href
              ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
              : 'text-base-content/55 hover:text-base-content hover:bg-base-200/60'
          }`}
        >
          <link.icon className={`w-[18px] h-[18px] ${pathname === link.href ? 'text-primary' : ''}`} />
          <span>{link.label}</span>
        </Link>
      ))}
      <div className="pt-4 mt-4 border-t border-base-300/60">
        <button onClick={logout} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error/70 hover:text-error hover:bg-error/5 w-full transition-all">
          <FiLogOut className="w-[18px] h-[18px]" /> Logout
        </button>
      </div>
    </nav>
  );
}
