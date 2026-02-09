import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className={styles.intro}>
          <h1>Shirym-Min Home page</h1>
          <p>
            Login to edit data.
          </p>
        </div>
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href="/login"
            
          >
            
            Login Now
          </a>
          <a
            className={styles.secondary}
            href="/dashboard"
            
          >
            Dashboard
          </a>
        </div>
      </main>
    </div>
  );
}
