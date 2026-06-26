import { ListSkeleton } from '@/components/ui/Skeleton';

export default function MyReviewsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="h-7 w-28 bg-base-300/60 rounded animate-pulse" />
          <div className="h-4 w-44 bg-base-300/60 rounded animate-pulse" />
        </div>
      </div>
      <ListSkeleton count={4} />
    </div>
  );
}
