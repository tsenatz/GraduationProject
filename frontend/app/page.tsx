import { Hero } from '@/components/home/Hero';
import { Recommendations } from '@/components/home/Recommendations';
import { Services } from '@/components/home/Services';

export default function Home() {
  return (
    <main style={{ minHeight: '150vh' }}>
      <Hero />
      <Recommendations />
      <Services />
    </main>
  );
}