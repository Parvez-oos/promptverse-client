import { DashboardSkeleton } from '@/components/ui/Skeleton';

export default function AdminDashboardLoading() {
  return (
    <div className="p-4 lg:p-8">
      <DashboardSkeleton />
    </div>
  );
}
