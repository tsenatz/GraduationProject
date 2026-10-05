import {
  GoogleIcon,
  AppleIcon,
  FacebookIcon,
} from "@/components/icons/SocialIcons";
import styles from "./SocialLoginButtons.module.css";

interface SocialLoginButtonsProps {
  onGoogle?: () => void;
  onApple?: () => void;
  onFacebook?: () => void;
}

/**
 * Row of social OAuth login/signup buttons (Google, Apple, Facebook).
 */
export function SocialLoginButtons({
  onGoogle,
  onApple,
  onFacebook,
}: SocialLoginButtonsProps) {
  return (
    <div className={styles.socialLogin}>
      <button type="button" className={styles.socialBtn} onClick={onGoogle}>
        <GoogleIcon className={styles.socialIcon} />
      </button>
      <button type="button" className={styles.socialBtn} onClick={onApple}>
        <AppleIcon className={styles.socialIcon} />
      </button>
      <button type="button" className={styles.socialBtn} onClick={onFacebook}>
        <FacebookIcon className={styles.socialIcon} />
      </button>
    </div>
  );
}
