import React from 'react';
import data from '../data/info.json';
import styles from './home.module.scss';

const TOP_TECH = ['TypeScript', 'React', 'Node.js', 'AWS', 'GCP', 'Java'];

export const Home: React.FC = () => {
  return (
    <div className={styles.hero}>
      <span className={styles.greeting}>Hello, world —</span>

      <div className={styles.nameBlock}>
        <span className={styles.firstName}>{data.name.first}</span>
        <span className={styles.lastName}>{data.name.last}</span>
      </div>

      <p className={styles.tagline}>
        Full Stack Developer crafting fast, scalable web applications —<br />
        from React frontends to cloud-native backends.
      </p>

      <div className={styles.cta}>
        <a
          href={data['social-media'].find(s => s.icon === 'linkedin')?.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnPrimary}
        >
          Connect on LinkedIn
        </a>
        <a
          href={data['social-media'].find(s => s.icon === 'github')?.link}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.btnSecondary}
        >
          View GitHub
        </a>
      </div>

      <div className={styles.divider} />

      <div className={styles.about}>
        <span className={styles.aboutLabel}>About</span>
        <p className={styles.aboutText}>{data.about}</p>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.stat}>
          <span className={styles.statValue}>5+</span>
          <span className={styles.statLabel}>Years experience</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>2</span>
          <span className={styles.statLabel}>Roles held</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>10+</span>
          <span className={styles.statLabel}>Technologies</span>
        </div>
      </div>

      <div className={styles.techStack}>
        <span className={styles.techLabel}>Core tech</span>
        <div className={styles.techTags}>
          {TOP_TECH.map((t) => (
            <span key={t} className={styles.techTag}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
