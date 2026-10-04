import React, { useEffect, useRef, useState } from 'react';
import data from '../data/info.json';
import styles from './skills.module.scss';

export const Skills: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let globalIndex = 0;

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Skills</h2>
      <div className={styles.groups} ref={ref}>
        {data.skills.map((group) => (
          <div key={group.name} className={styles.group}>
            <span className={styles.groupName}>{group.name}</span>
            <div className={styles.tags}>
              {group.value.map((skill) => {
                const idx = globalIndex++;
                return (
                  <span
                    key={skill}
                    className={styles.tag}
                    style={{
                      opacity: visible ? 1 : 0,
                      transform: visible ? 'translateY(0)' : 'translateY(10px)',
                      transition: `opacity 0.4s ease ${idx * 0.04}s, transform 0.4s ease ${idx * 0.04}s`,
                    }}
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
