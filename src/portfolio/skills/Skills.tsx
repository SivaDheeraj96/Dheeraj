import React, { useEffect, useRef, useState } from 'react';
import data from '../data/info.json';
import styles from './skills.module.scss';

const CATEGORY_META: Record<string, { icon: string; accent: string; accentBorder: string; tagHoverBg: string; tagHoverColor: string }> = {
  'Frontend': {
    icon: '⬡',
    accent: '#00d1d1',
    accentBorder: 'rgba(0,209,209,0.35)',
    tagHoverBg: 'rgba(0,209,209,0.08)',
    tagHoverColor: '#00d1d1',
  },
  'Backend & Scripting': {
    icon: '⬡',
    accent: '#7b2fbe',
    accentBorder: 'rgba(123,47,190,0.4)',
    tagHoverBg: 'rgba(123,47,190,0.1)',
    tagHoverColor: '#a855f7',
  },
  'Cloud & DevOps': {
    icon: '⬡',
    accent: '#0ea5e9',
    accentBorder: 'rgba(14,165,233,0.35)',
    tagHoverBg: 'rgba(14,165,233,0.08)',
    tagHoverColor: '#38bdf8',
  },
  'Frameworks & Tools': {
    icon: '⬡',
    accent: '#f59e0b',
    accentBorder: 'rgba(245,158,11,0.35)',
    tagHoverBg: 'rgba(245,158,11,0.08)',
    tagHoverColor: '#fbbf24',
  },
};

const ICONS: Record<string, string> = {
  'Frontend':             '◈',
  'Backend & Scripting':  '⊡',
  'Cloud & DevOps':       '⊕',
  'Frameworks & Tools':   '⊞',
};

export const Skills: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.05 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  let globalIndex = 0;

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Skills</h2>
      <div className={styles.grid} ref={ref}>
        {data.skills.map((group) => {
          const meta = CATEGORY_META[group.name] ?? CATEGORY_META['Frontend'];
          return (
            <div
              key={group.name}
              className={styles.card}
              style={{
                '--accent': meta.accent,
                '--accent-border': meta.accentBorder,
                '--tag-hover-bg': meta.tagHoverBg,
                '--tag-hover-color': meta.tagHoverColor,
              } as React.CSSProperties}
            >
              <div className={styles.cardHeader}>
                <span className={styles.categoryIcon} style={{ color: meta.accent }}>
                  {ICONS[group.name] ?? '◈'}
                </span>
                <span className={styles.groupName}>{group.name}</span>
              </div>
              <div className={styles.tags}>
                {group.value.map((skill) => {
                  const idx = globalIndex++;
                  return (
                    <span
                      key={skill}
                      className={styles.tag}
                      style={{
                        opacity: visible ? 1 : 0,
                        transform: visible ? 'translateY(0)' : 'translateY(8px)',
                        transition: `opacity 0.35s ease ${idx * 0.035}s, transform 0.35s ease ${idx * 0.035}s`,
                      }}
                    >
                      {skill}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
