'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { FiStar, FiMessageSquare } from 'react-icons/fi';
import { reviewService } from '@/services/reviewService';
import { formatDate } from '@/lib/utils';

const transitionSpring = { type: 'spring' as const, damping: 20, stiffness: 200 };
const transitionSpringLight = { type: 'spring' as const, damping: 15 };

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: transitionSpring,
  },
};

export default function CustomerReviews() {
  const { data: reviewsData } = useQuery({
    queryKey: ['homeReviews'],
    queryFn: () => reviewService.getRecentReviews(),
  });

  const reviews = reviewsData?.data?.slice(0, 6) || [];

  return (
    <section className="section-padding bg-base-200/50 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={transitionSpring}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-2 text-primary text-sm font-medium mb-2"
          >
            <motion.div
              animate={{ rotate: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
              <FiMessageSquare className="w-4 h-4" />
            </motion.div>
            <span>Community Feedback</span>
          </motion.div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 tracking-tight">
            What Our <span className="gradient-text">Users Say</span>
          </h2>
          <p className="text-base-content/55">
            Hear from our community about their experience with PromptVerse.
          </p>
        </motion.div>

        {reviews.length === 0 ? (
          <p className="text-center text-base-content/40">No reviews yet. Be the first to share your experience!</p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {reviews.map((review: any) => (
              <motion.div
                key={review._id}
                variants={itemVariants}
                whileHover={{ y: -3, transition: transitionSpringLight }}
                className="card bg-base-100 border border-base-300 p-6 relative"
              >
                <FiMessageSquare className="absolute top-4 right-4 w-6 h-6 text-base-content/10" />
                <div className="flex items-center gap-3 mb-3">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/15 to-secondary/15 flex items-center justify-center text-sm font-bold text-primary overflow-hidden"
                  >
                    {review.user?.photoURL ? (
                      <img src={review.user.photoURL} alt="" className="w-full h-full object-cover" />
                    ) : (
                      review.user?.name?.charAt(0)?.toUpperCase() || 'U'
                    )}
                  </motion.div>
                  <div>
                    <p className="font-medium text-sm">{review.user?.name || 'Anonymous'}</p>
                    <p className="text-xs text-base-content/40">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <FiStar
                        className={`w-4 h-4 ${i < review.rating ? 'text-warning fill-warning' : 'text-base-content/20'}`}
                      />
                    </motion.div>
                  ))}
                </div>
                <p className="text-sm text-base-content/55 leading-relaxed line-clamp-3 italic">
                  &ldquo;{review.comment}&rdquo;
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
