import { Hero } from '@/components/home/Hero';
import { Recommendations } from '@/components/home/Recommendations';
import { Services } from '@/components/home/Services';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.mainContainer}>
      <Hero />
      <Recommendations />
      <Services />
    </main>
  );
}