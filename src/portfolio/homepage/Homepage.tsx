import React, { useEffect, useRef, useState } from 'react';
import { LeftRail } from './LeftRail';
import { Home } from '../Home/Home';
import { Skills } from '../skills/Skills';
import { Experience } from '../experience/Experience';
import { Education } from '../education/Education';
import { Contact } from '../contact/Contact';
import styles from './styles/homepage.module.scss';

export type SectionType = 'home' | 'skills' | 'experience' | 'education' | 'contact';

const SECTIONS: SectionType[] = ['home', 'skills', 'experience', 'education', 'contact'];

const SECTION_COMPONENTS: Record<SectionType, React.FC> = {
  home:       Home,
  skills:     Skills,
  experience: Experience,
  education:  Education,
  contact:    Contact,
};

export const Homepage: React.FC = () => {
  const [active, setActive] = useState<SectionType>('home');
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Scroll to section when nav icon is clicked
  const handleNavClick = (id: SectionType) => {
    const el = sectionRefs.current[id];
    if (el && mainRef.current) {
      mainRef.current.scrollTo({ top: el.offsetTop - 40, behavior: 'smooth' });
    }
  };

  // Track active section via IntersectionObserver
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id as SectionType);
          }
        });
      },
      {
        root: container,
        // Trigger when section crosses the top 30–60% band of the scroll container
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0,
      }
    );

    SECTIONS.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <LeftRail active={active} onNavClick={handleNavClick} />
      </aside>

      <main className={styles.main} ref={mainRef}>
        <div className={styles.content}>
          {SECTIONS.map((id) => {
            const Section = SECTION_COMPONENTS[id];
            return (
              <div
                key={id}
                id={id}
                className={styles.sectionBlock}
                ref={(el) => { sectionRefs.current[id] = el; }}
              >
                <Section />
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};
