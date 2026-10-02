import { Hero } from '../components/hero';
import { Recommendations } from '../components/Recommendations';
import { Services } from '../components/Services';

export default function Home() {
  return (
    <main style={{ paddingLeft: '64px', minHeight: '150vh' }}>
      <Hero />
      <Recommendations />
      <Services />
    </main>
  );
}
