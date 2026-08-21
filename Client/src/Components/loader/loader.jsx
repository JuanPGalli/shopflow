import styles from './loader.module.css';

export default function Loader() {
  return (
    <div className={styles.loaderWrapper} role='status' aria-live='polite'>
      <div className={styles.spinner} />
      <span className={styles.loadingText}>Cargando...</span>
    </div>
  );
}
