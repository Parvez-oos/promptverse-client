import { TableSkeleton } from '@/components/ui/Skeleton';

export default function CreatorMyPromptsLoading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <div className="h-7 w-28 bg-base-300/60 rounded animate-pulse" />
          <div className="h-4 w-44 bg-base-300/60 rounded animate-pulse" />
        </div>
        <div className="h-9 w-32 bg-base-300/60 rounded-lg animate-pulse" />
      </div>
      <TableSkeleton rows={6} cols={7} />
    </div>
  );
}
