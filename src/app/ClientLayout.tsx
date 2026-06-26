'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import { AuthProvider } from '@/providers/AuthProvider';
import { SocketProvider } from '@/providers/SocketProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const dashboardPaths = ['/dashboard', '/creator-dashboard', '/admin-dashboard'];

export default function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = dashboardPaths.some((path) => pathname.startsWith(path));

  return (
    <ReactQueryProvider>
      <AuthProvider>
        <SocketProvider>
          <div className="min-h-screen flex flex-col">
            {!isDashboard && <Navbar />}
            <main className={`flex-1 ${!isDashboard ? 'pt-16' : ''}`}>
              {children}
            </main>
            {!isDashboard && <Footer />}
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                borderRadius: '12px',
              },
            }}
          />
        </SocketProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
