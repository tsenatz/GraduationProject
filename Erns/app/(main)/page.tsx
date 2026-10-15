import { Hero } from '@/components/home/Hero';
import { FeaturedProperties } from '@/components/home/FeaturedProperties';
import { Services } from '@/components/home/Services';
import { HomeDirectory } from '@/components/home/HomeDirectory';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.mainContainer}>
      <Hero />
      <FeaturedProperties />
      <Services />
      <HomeDirectory />
    </main>
  );
}