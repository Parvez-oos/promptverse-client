'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Banner from '@/components/home/Banner';
import FeaturedPrompts from '@/components/home/FeaturedPrompts';
import WhyChooseUs from '@/components/home/WhyChooseUs';
import TopCreators from '@/components/home/TopCreators';
import CustomerReviews from '@/components/home/CustomerReviews';
import StatsSection from '@/components/home/StatsSection';
import CTASection from '@/components/home/CTASection';

export default function HomePage() {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <Banner />
        <FeaturedPrompts />
        <WhyChooseUs />
        <TopCreators />
        <CustomerReviews />
        <StatsSection />
        <CTASection />
      </motion.div>
    </AnimatePresence>
  );
}
