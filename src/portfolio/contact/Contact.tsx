import React from 'react';
import data from '../data/info.json';
import styles from './contact.module.scss';

interface ContactItem {
  type: string;
  label: string;
  href: string;
  icon: string;
}

export const Contact: React.FC = () => {
  const items: ContactItem[] = [
    {
      type: 'Email',
      label: data.contact.email,
      href: `mailto:${data.contact.email}`,
      icon: '✉',
    },
    ...data['social-media'].map((sm) => ({
      type: sm.name,
      label: sm.text,
      href: sm.link,
      icon: sm.icon === 'github' ? '⌥' : '⊞',
    })),
  ];

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Contact</h2>
      <p className={styles.intro}>
        I'm always open to new opportunities, collaborations, or just a good conversation about tech. Drop me a message through any of the channels below.
      </p>
      <div className={styles.cards}>
        {items.map((item) => (
          <a
            key={item.type}
            href={item.href}
            target={item.href.startsWith('mailto') ? undefined : '_blank'}
            rel="noopener noreferrer"
            className={styles.card}
          >
            <div className={styles.iconBox}>{item.icon}</div>
            <div className={styles.info}>
              <span className={styles.type}>{item.type}</span>
              <span className={styles.label}>{item.label}</span>
            </div>
            <span className={styles.arrow}>→</span>
          </a>
        ))}
      </div>
    </div>
  );
};
