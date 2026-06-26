import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from './ClientLayout';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'PromptVerse - AI Prompt Marketplace',
  description: 'Discover, create, and share premium AI prompts for ChatGPT, Gemini, Claude, Midjourney, and more.',
  keywords: ['AI prompts', 'ChatGPT prompts', 'prompt marketplace', 'AI tools', 'prompt engineering'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
