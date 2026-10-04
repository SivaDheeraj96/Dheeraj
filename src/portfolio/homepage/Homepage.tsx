import React from 'react';
import { LeftRail } from './LeftRail';
import { Home } from '../Home/Home';
import { Skills } from '../skills/Skills';
import { Experience } from '../experience/Experience';
import { Education } from '../education/Education';
import { Contact } from '../contact/Contact';
import styles from './styles/homepage.module.scss';

export type SectionType = 'home' | 'skills' | 'experience' | 'education' | 'contact';

export const Homepage: React.FC = () => {
  const [section, setSection] = React.useState<SectionType>('home');

  const renderSection = () => {
    switch (section) {
      case 'home':       return <Home />;
      case 'skills':     return <Skills />;
      case 'experience': return <Experience />;
      case 'education':  return <Education />;
      case 'contact':    return <Contact />;
    }
  };

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <LeftRail active={section} setSection={setSection} />
      </aside>
      <main className={styles.main}>
        <div className={styles.content}>
          {renderSection()}
        </div>
      </main>
    </div>
  );
};
