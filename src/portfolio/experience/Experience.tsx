import React from 'react';
import data from '../data/info.json';
import styles from './experience.module.scss';

export const Experience: React.FC = () => {
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Experience</h2>
      <div className={styles.timeline}>
        {data.experience.map((exp, i) => (
          <div key={i} className={styles.item}>
            <div className={styles.dot} />
            <div className={styles.body}>
              <div className={styles.header}>
                <span className={styles.role}>{exp.role}</span>
                <div className={styles.meta}>
                  <span className={styles.company}>{exp.company}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.location}>{exp.location}</span>
                  <span className={styles.separator}>·</span>
                  <span className={styles.period}>{exp.period}</span>
                </div>
              </div>
              <ul className={styles.bullets}>
                {exp.bullets.map((b, j) => (
                  <li key={j} className={styles.bullet}>{b}</li>
                ))}
              </ul>
              <div className={styles.techRow}>
                {exp.tech.map((t) => (
                  <span key={t} className={styles.techTag}>{t}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
