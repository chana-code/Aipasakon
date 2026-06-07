import { Hero } from '@/components/landing/Hero';
import { SpecialtyBand } from '@/components/landing/SpecialtyBand';
import { ContentCards } from '@/components/landing/ContentCards';
import { VisualRow } from '@/components/landing/VisualRow';
import { AboutScene } from '@/components/landing/AboutScene';

export default function HomePage() {
  return (
    <>
      <Hero />
      <SpecialtyBand />
      <ContentCards />
      <VisualRow />
      <AboutScene />
    </>
  );
}
