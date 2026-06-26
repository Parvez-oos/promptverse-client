'use client';

import { ReactNode } from 'react';
import { FiInbox } from 'react-icons/fi';

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
}

export default function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-base-200 flex items-center justify-center mb-4">
        {icon || <FiInbox className="w-7 h-7 text-base-content/30" />}
      </div>
      <h3 className="text-lg font-semibold text-base-content/70 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-base-content/40 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
