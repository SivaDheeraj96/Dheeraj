import React from 'react';
import { SectionType } from './Homepage';
import data from '../data/info.json';
import pic from '../static/profile-pic.jpeg';
import styles from './styles/leftRail.module.scss';

interface NavItem {
  id: SectionType;
  label: string;
  icon: string;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',       label: 'Home',       icon: '⌂' },
  { id: 'skills',     label: 'Skills',     icon: '◈' },
  { id: 'experience', label: 'Experience', icon: '◉' },
  { id: 'education',  label: 'Education',  icon: '◎' },
  { id: 'contact',    label: 'Contact',    icon: '◻' },
];

interface Props {
  active: SectionType;
  setSection: (s: SectionType) => void;
}

export const LeftRail: React.FC<Props> = ({ active, setSection }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.profile}>
        <div className={styles.avatarWrapper}>
          <img src={pic} alt={`${data.name.first} ${data.name.last}`} />
        </div>
        <span className={styles.name}>{data.name.first}<br />{data.name.last}</span>
        <span className={styles.title}>{data.title}</span>
        <span className={styles.statusDot}>Available for work</span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <div
            key={item.id}
            className={`${styles.navItem} ${active === item.id ? styles.active : ''}`}
            onClick={() => setSection(item.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setSection(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        {data['social-media'].map((sm) => (
          <a
            key={sm.name}
            href={sm.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
          >
            <span className={styles.socialIcon}>
              {sm.icon === 'github' ? '⌥' : '⊞'}
            </span>
            {sm.text}
          </a>
        ))}
      </div>
    </div>
  );
};
