import { PromptDetailSkeleton } from '@/components/ui/Skeleton';

export default function PromptDetailLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <PromptDetailSkeleton />
    </div>
  );
}
