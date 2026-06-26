'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiStar, FiMessageSquare } from 'react-icons/fi';
import { reviewService } from '@/services/reviewService';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { ListSkeleton } from '@/components/ui/Skeleton';
import EmptyState from '@/components/ui/EmptyState';
import ErrorDisplay from '@/components/ui/ErrorDisplay';
import { formatDate } from '@/lib/utils';

export default function MyReviewsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['myReviews'],
    queryFn: () => reviewService.getMyReviews(),
  });

  const reviews = data?.data || [];

  if (isLoading) return <ListSkeleton count={4} />;
  if (isError) return <ErrorDisplay onRetry={refetch} />;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Reviews</h1>
          <p className="text-sm text-base-content/50">Reviews you have submitted</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState
          icon={<FiMessageSquare className="w-7 h-7 text-base-content/30" />}
          title="No reviews yet"
          description="Review prompts you have used to share your feedback."
        />
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review._id} className="card bg-base-100 border border-base-300 p-5">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-sm">
                    {review.prompt?.title || 'Deleted Prompt'}
                  </p>
                  <p className="text-xs text-base-content/40">
                    {review.prompt?.category} &middot; {review.prompt?.aiTool} &middot; {formatDate(review.createdAt)}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FiStar
                      key={i}
                      className={`w-4 h-4 ${i < review.rating ? 'text-warning fill-warning' : 'text-base-content/20'}`}
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-base-content/60">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
