'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHome, FiFileText, FiPlusCircle, FiBookmark, FiStar, FiUser,
  FiLogOut, FiMenu, FiX, FiChevronRight, FiSun, FiMoon, FiLayout,
  FiSettings, FiHelpCircle,
} from 'react-icons/fi';
import { FaXTwitter } from 'react-icons/fa6';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/hooks/useTheme';

const sidebarLinks = [
  { href: '/dashboard', label: 'Overview', icon: FiLayout },
  { href: '/dashboard/profile', label: 'Profile', icon: FiUser },
  { href: '/dashboard/add-prompt', label: 'Add Prompt', icon: FiPlusCircle },
  { href: '/dashboard/my-prompts', label: 'My Prompts', icon: FiFileText },
  { href: '/dashboard/saved-prompts', label: 'Saved Prompts', icon: FiBookmark },
  { href: '/dashboard/my-reviews', label: 'My Reviews', icon: FiStar },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout, isPremium } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
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

  return (
    <div className="min-h-screen bg-base-200/30">
      {/* Mobile Top Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 glass border-b border-base-300/50 h-16 flex items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
            <span className="text-white font-bold text-xs">PV</span>
          </div>
          <span className="font-bold text-sm tracking-tight">PromptVerse</span>
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

      {/* Mobile Sidebar Overlay */}
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
                  <Link href="/" className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white font-bold text-xs">PV</span>
                    </div>
                    <span className="font-bold">PromptVerse</span>
                  </Link>
                  <button onClick={() => setSidebarOpen(false)} className="btn btn-ghost btn-sm btn-square rounded-xl">
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <DashboardSidebarContent pathname={pathname} user={user} isPremium={isPremium} logout={logout} />
              </div>
              <MobileSidebarFooter toggleTheme={toggleTheme} isDark={isDark} />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-base-100 border-r border-base-300 flex-col z-40">
        <div className="p-5 border-b border-base-300">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">PV</span>
            </div>
            <div>
              <span className="font-bold text-lg tracking-tight block leading-none">PromptVerse</span>
              <span className="text-[10px] text-base-content/40 font-medium uppercase tracking-wider">Dashboard</span>
            </div>
          </Link>
        </div>
        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          <DashboardSidebarContent pathname={pathname} user={user} isPremium={isPremium} logout={logout} />
        </div>
        <SidebarFooter user={user} toggleTheme={toggleTheme} isDark={isDark} logout={logout} />
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 min-h-screen">
        <div className="h-16 lg:hidden" />
        <div className="p-4 sm:p-6 lg:p-8 max-w-[1400px]">
          {children}
        </div>
      </div>
    </div>
  );
}

function DashboardSidebarContent({ pathname, user, isPremium, logout }: {
  pathname: string;
  user: any;
  isPremium: boolean;
  logout: () => void;
}) {
  return (
    <nav className="space-y-1">
      <div className="mb-3">
        <p className="text-[10px] font-semibold text-base-content/30 uppercase tracking-wider px-3 mb-2">Main Menu</p>
      </div>
      {sidebarLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-primary/10 text-primary shadow-sm shadow-primary/5'
                : 'text-base-content/55 hover:text-base-content hover:bg-base-200/60'
            }`}
          >
            <link.icon className={`w-[18px] h-[18px] ${isActive ? 'text-primary' : ''}`} />
            <span>{link.label}</span>
          </Link>
        );
      })}

      {(user?.role === 'creator' || user?.role === 'admin') && (
        <>
          <div className="pt-3 mt-2">
            <p className="text-[10px] font-semibold text-base-content/30 uppercase tracking-wider px-3 mb-2">Creator</p>
          </div>
          <Link
            href="/creator-dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-secondary/80 hover:text-secondary hover:bg-secondary/5 transition-all"
          >
            <FiChevronRight className="w-[18px] h-[18px]" />
            <span>Creator Dashboard</span>
          </Link>
        </>
      )}

      {user?.role === 'admin' && (
        <>
          <div className="pt-3 mt-2">
            <p className="text-[10px] font-semibold text-base-content/30 uppercase tracking-wider px-3 mb-2">Admin</p>
          </div>
          <Link
            href="/admin-dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-accent/80 hover:text-accent hover:bg-accent/5 transition-all"
          >
            <FiChevronRight className="w-[18px] h-[18px]" />
            <span>Admin Dashboard</span>
          </Link>
        </>
      )}

      <div className="pt-4 mt-4 border-t border-base-300/60">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold overflow-hidden shrink-0 ring-2 ring-base-100 shadow-sm">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0)?.toUpperCase() || 'U'
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{user?.name || 'User'}</p>
            <p className="text-[11px] text-base-content/40 truncate">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 mt-1">
          <span className="badge badge-xs capitalize bg-base-200 text-base-content/60 border-0 font-medium">{user?.role}</span>
          {isPremium ? (
            <span className="badge badge-xs gap-1 bg-accent/10 text-accent border-0 font-medium">
              Premium
            </span>
          ) : (
            <Link href="/payment" className="badge badge-xs hover:bg-primary/10 hover:text-primary border-0 cursor-pointer transition-colors font-medium">
              Upgrade
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

function SidebarFooter({ user, toggleTheme, isDark, logout }: {
  user: any;
  toggleTheme: () => void;
  isDark: boolean;
  logout: () => void;
}) {
  return (
    <div className="p-3 border-t border-base-300 space-y-1">
      <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/55 hover:text-base-content hover:bg-base-200/60 w-full transition-all">
        {isDark ? <FiSun className="w-[18px] h-[18px]" /> : <FiMoon className="w-[18px] h-[18px]" />}
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
      <a
        href="https://x.com/promptverse"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/40 hover:text-base-content/60 hover:bg-base-200/40 transition-all"
      >
        <FaXTwitter className="w-[18px] h-[18px]" />
        <span>Follow on X</span>
      </a>
      <button
        onClick={logout}
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-error/70 hover:text-error hover:bg-error/5 w-full transition-all"
      >
        <FiLogOut className="w-[18px] h-[18px]" />
        <span>Logout</span>
      </button>
    </div>
  );
}

function MobileSidebarFooter({ toggleTheme, isDark }: {
  toggleTheme: () => void;
  isDark: boolean;
}) {
  return (
    <div className="p-4 border-t border-base-300 space-y-1">
      <button onClick={toggleTheme} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/55 hover:text-base-content hover:bg-base-200/60 w-full transition-all">
        {isDark ? <FiSun className="w-[18px] h-[18px]" /> : <FiMoon className="w-[18px] h-[18px]" />}
        <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
      </button>
      <a
        href="https://x.com/promptverse"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-base-content/40 hover:text-base-content/60 hover:bg-base-200/40 transition-all"
      >
        <FaXTwitter className="w-[18px] h-[18px]" />
        <span>Follow on X</span>
      </a>
    </div>
  );
}
