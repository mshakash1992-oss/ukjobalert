import styles from "./loading.module.css";

export default function Loading() {
  return (
    <div className={styles.loading} role="status" aria-label="Loading page">
      <span className={styles.spinner} aria-hidden="true" />
      <span className={styles.screenReaderOnly}>Loading...</span>
    </div>
  );
}
