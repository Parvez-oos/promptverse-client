'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiLogOut, FiSun, FiMoon, FiUser, FiLayout } from 'react-icons/fi';
import { useAuth } from '@/providers/AuthProvider';
import { useTheme } from '@/hooks/useTheme';
import NotificationBell from '@/components/ui/NotificationBell';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/all-prompts', label: 'All Prompts' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-base-300/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-[4.5rem]">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
              <span className="text-white font-bold text-sm">PV</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              PromptVerse
            </span>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.href)
                    ? 'bg-primary/10 text-primary'
                    : 'text-base-content/60 hover:text-base-content hover:bg-base-200/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-square rounded-xl"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>

            {isAuthenticated && user ? (
              <div className="flex items-center gap-1.5">
                <NotificationBell />
                <Link
                  href="/dashboard/profile"
                  className="btn btn-ghost btn-sm rounded-xl gap-2"
                >
                  <FiLayout className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="dropdown dropdown-end">
                  <label tabIndex={0} className="btn btn-ghost btn-sm btn-circle avatar">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold overflow-hidden ring-2 ring-base-100 shadow-sm">
                      {user.photoURL ? (
                        <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                      ) : (
                        user.name?.charAt(0)?.toUpperCase() || 'U'
                      )}
                    </div>
                  </label>
                  <ul tabIndex={0} className="dropdown-content menu p-2 shadow-xl bg-base-100 rounded-2xl border border-base-300 w-52 mt-2">
                    <li className="px-3 py-2 text-sm font-medium text-base-content/60 border-b border-base-300/60">
                      {user.name}
                    </li>
                    <li>
                      <Link href="/dashboard/profile" className="gap-2 rounded-xl">
                        <FiUser className="w-4 h-4" /> Profile
                      </Link>
                    </li>
                    <li>
                      <button onClick={logout} className="gap-2 text-error rounded-xl">
                        <FiLogOut className="w-4 h-4" /> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="btn btn-ghost btn-sm rounded-xl">
                  Login
                </Link>
                <Link href="/register" className="btn btn-primary btn-sm rounded-xl">
                  Register
                </Link>
              </div>
            )}
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-sm btn-square rounded-xl"
              aria-label="Toggle theme"
            >
              {isDark ? <FiSun className="w-4 h-4" /> : <FiMoon className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="btn btn-ghost btn-sm btn-square rounded-xl"
            >
              {mobileOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-base-300/50 bg-base-100/95 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-base-content/60 hover:bg-base-200/60'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-base-300/60 pt-2 mt-2">
                {isAuthenticated && user ? (
                  <>
                    <div className="px-4 py-2 text-xs font-medium text-base-content/40 uppercase tracking-wider flex items-center justify-between">
                      <span>{user.name}</span>
                      <NotificationBell />
                    </div>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-base-200/60"
                    >
                      <FiLayout className="w-4 h-4 text-primary" />
                      <span>Dashboard</span>
                    </Link>
                    <button
                      onClick={() => { logout(); setMobileOpen(false); }}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-error hover:bg-error/10 w-full"
                    >
                      <FiLogOut className="w-4 h-4" /> Logout
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <Link
                      href="/login"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 btn btn-outline btn-sm rounded-xl"
                    >
                      Login
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileOpen(false)}
                      className="flex-1 btn btn-primary btn-sm rounded-xl"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
