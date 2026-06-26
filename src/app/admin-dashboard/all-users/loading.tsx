import { TableSkeleton } from '@/components/ui/Skeleton';

export default function AllUsersLoading() {
  return (
    <div>
      <div className="mb-6 space-y-1">
        <div className="h-7 w-24 bg-base-300/60 rounded animate-pulse" />
        <div className="h-4 w-32 bg-base-300/60 rounded animate-pulse" />
      </div>
      <TableSkeleton rows={8} cols={7} />
    </div>
  );
}
