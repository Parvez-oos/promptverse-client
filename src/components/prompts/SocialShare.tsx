'use client';

import { FiTwitter, FiFacebook, FiLinkedin, FiSend, FiLink } from 'react-icons/fi';
import toast from 'react-hot-toast';

interface SocialShareProps {
  url: string;
  title: string;
  description?: string;
}

export default function SocialShare({ url, title, description }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description || '');

  const shareLinks = [
    {
      name: 'Twitter',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: FiTwitter,
      color: 'hover:text-blue-400',
    },
    {
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FiFacebook,
      color: 'hover:text-blue-600',
    },
    {
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      icon: FiLinkedin,
      color: 'hover:text-blue-500',
    },
    {
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: FiSend,
      color: 'hover:text-green-500',
    },
  ];

  const copyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success('Link copied!');
  };

  return (
    <div className="flex items-center gap-2">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-ghost btn-sm btn-square rounded-xl transition-colors ${link.color}`}
          title={`Share on ${link.name}`}
        >
          <link.icon className="w-4 h-4" />
        </a>
      ))}
      <button
        onClick={copyLink}
        className="btn btn-ghost btn-sm btn-square rounded-xl hover:text-primary transition-colors"
        title="Copy link"
      >
        <FiLink className="w-4 h-4" />
      </button>
    </div>
  );
}
