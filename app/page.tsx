import { Hero } from '@/components/home/Hero';
import { ThreeDoors } from '@/components/home/ThreeDoors';
import { LatestReviewed } from '@/components/home/LatestReviewed';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ThreeDoors />
      <LatestReviewed />
    </>
  );
}
