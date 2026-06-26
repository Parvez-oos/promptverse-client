import { CardSkeleton } from '@/components/ui/Skeleton';

export default function SavedPromptsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="h-7 w-32 bg-base-300/60 rounded animate-pulse" />
          <div className="h-4 w-48 bg-base-300/60 rounded animate-pulse" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
      </div>
    </div>
  );
}
