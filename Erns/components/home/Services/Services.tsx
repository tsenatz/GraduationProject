import { ServiceCard } from "@/components/home/ServiceCard";
import styles from "./Services.module.css";

const SERVICE_ITEMS = [
  {
    imageSrc: "/buy-house.jpg",
    imageAlt: "Buy a house illustration",
    title: "Buy a home",
    description:
      "A real estate agent can provide you with a clear breakdown of costs so that you can avoid surprise expenses.",
    buttonLabel: "Find a local agent",
    href: "/agents",
  },
  {
    imageSrc: "/rent-house.jpg",
    imageAlt: "Rent a house illustration",
    title: "Rent a home",
    description:
      "We're creating a seamless online experience – from shopping on the largest rental network, to applying, to paying rent.",
    buttonLabel: "Find rentals",
    href: "/search?status=FOR_RENT",
  },
  {
    imageSrc: "/sell-house.jpg",
    imageAlt: "Sell a house illustration",
    title: "Sell a home",
    description:
      "No matter what path you take to sell your home, we can help you navigate a successful sale.",
    buttonLabel: "See your options",
    href: "/sell",
  },
];

export function Services() {
  return (
    <section className={styles.container}>
      <div className={styles.cardsWrapper}>
        {SERVICE_ITEMS.map((item) => (
          <ServiceCard key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}
