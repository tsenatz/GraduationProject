import styles from "./AuthPageLayout.module.css";

interface AuthPageLayoutProps {
  imagePanelSlot: React.ReactNode;
  formSectionSlot: React.ReactNode;
  /** Extra CSS classes for the formSection (e.g. overflow-y: auto for signup) */
  formSectionClassName?: string;
}

/**
 * Two-column auth page shell.
 * Left column: image panel (hidden on mobile).
 * Right column: form section.
 */
export function AuthPageLayout({
  imagePanelSlot,
  formSectionSlot,
  formSectionClassName = "",
}: AuthPageLayoutProps) {
  return (
    <main className={styles.container}>
      <section className={styles.imageSection}>{imagePanelSlot}</section>
      <section className={`${styles.formSection} ${formSectionClassName}`}>
        {formSectionSlot}
      </section>
    </main>
  );
}
