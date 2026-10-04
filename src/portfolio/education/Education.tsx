import React from 'react';
import data from '../data/info.json';
import styles from './education.module.scss';

export const Education: React.FC = () => {
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Education</h2>
      <div className={styles.list}>
        {data.education.map((edu, i) => (
          <div key={i} className={styles.card}>
            <span className={styles.degree}>{edu.degree}</span>
            <span className={styles.school}>{edu.school}</span>
            <span className={styles.period}>{edu.period}</span>
            {edu.details && <p className={styles.details}>{edu.details}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};
