import React, { useEffect, useRef, useState, useCallback } from 'react';
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
  const [showTop, setShowTop] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleNavClick = useCallback((id: SectionType) => {
    const el = sectionRefs.current[id];
    if (el && mainRef.current) {
      mainRef.current.scrollTo({ top: el.offsetTop - 40, behavior: 'smooth' });
    }
  }, []);

  const scrollToTop = useCallback(() => {
    mainRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Active section tracking + back-to-top visibility
  useEffect(() => {
    const container = mainRef.current;
    if (!container) return;

    const onScroll = () => setShowTop(container.scrollTop > 300);
    container.addEventListener('scroll', onScroll, { passive: true });

    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id as SectionType);
        });
      },
      { root: container, rootMargin: '-30% 0px -60% 0px', threshold: 0 }
    );

    // Scroll-reveal observer
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { root: container, threshold: 0.08 }
    );

    SECTIONS.forEach((id) => {
      const el = sectionRefs.current[id];
      if (el) {
        navObserver.observe(el);
        el.classList.add('reveal');
        revealObserver.observe(el);
      }
    });

    return () => {
      container.removeEventListener('scroll', onScroll);
      navObserver.disconnect();
      revealObserver.disconnect();
    };
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

      <button
        className={`${styles.backToTop} ${showTop ? styles.backToTopVisible : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
      >
        ↑
      </button>
    </div>
  );
};
