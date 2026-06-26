import { ListSkeleton } from '@/components/ui/Skeleton';

export default function ReportedPromptsLoading() {
  return (
    <div>
      <div className="mb-6 space-y-1">
        <div className="h-7 w-36 bg-base-300/60 rounded animate-pulse" />
        <div className="h-4 w-32 bg-base-300/60 rounded animate-pulse" />
      </div>
      <ListSkeleton count={5} />
    </div>
  );
}
