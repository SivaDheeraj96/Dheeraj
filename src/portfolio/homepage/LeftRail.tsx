import React from 'react';
import { SectionType } from './Homepage';
import data from '../data/info.json';
import pic from '../static/profile-pic.jpeg';
import styles from './styles/leftRail.module.scss';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/>
    <path d="M9 21V12h6v9"/>
  </svg>
);

const SkillsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

const ExperienceIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);

const EducationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
  </svg>
);

const ContactIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);

const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
  </svg>
);

const LinkedInIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z"/>
    <rect x="2" y="9" width="4" height="12"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

interface NavItem {
  id: SectionType;
  label: string;
  Icon: React.FC;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home',       label: 'Home',       Icon: HomeIcon },
  { id: 'skills',     label: 'Skills',     Icon: SkillsIcon },
  { id: 'experience', label: 'Experience', Icon: ExperienceIcon },
  { id: 'education',  label: 'Education',  Icon: EducationIcon },
  { id: 'contact',    label: 'Contact',    Icon: ContactIcon },
];

interface Props {
  active: SectionType;
  onNavClick: (id: SectionType) => void;
}

export const LeftRail: React.FC<Props> = ({ active, onNavClick }) => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.profile}>
        <div className={styles.avatarWrapper}>
          <img src={pic} alt={`${data.name.first} ${data.name.last}`} />
        </div>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <div
            key={id}
            className={`${styles.navItem} ${active === id ? styles.active : ''}`}
            onClick={() => onNavClick(id)}
            role="button"
            tabIndex={0}
            aria-label={label}
            onKeyDown={(e) => e.key === 'Enter' && onNavClick(id)}
          >
            <Icon />
            <span className={styles.tooltip}>{label}</span>
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
            aria-label={sm.name}
          >
            {sm.icon === 'github' ? <GithubIcon /> : <LinkedInIcon />}
          </a>
        ))}
      </div>
    </div>
  );
};
