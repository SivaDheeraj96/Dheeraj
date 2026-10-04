import React, { useEffect, useRef, useState } from 'react';
import data from '../data/info.json';
import pic from '../static/profile-pic.jpeg';
import styles from './home.module.scss';

const TAGLINE = "Front-end engineer specializing in AI-powered features — streaming chat UIs, agentic tools, and React at scale.";
const TOP_TECH = ['TypeScript', 'React', 'Redux', 'Node.js', 'AWS', 'AI / LLM'];

/* ── Typewriter hook ── */
const useTypewriter = (text: string, speed = 22, delay = 600) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const start = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(start);
  }, [text, speed, delay]);

  return { displayed, done };
};

/* ── Count-up hook ── */
const useCountUp = (target: number, duration = 1800) => {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let frame = 0;
    const totalFrames = Math.round((duration / 1000) * 60);
    const iv = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.min(Math.round(eased * target), target));
      if (frame >= totalFrames) clearInterval(iv);
    }, 1000 / 60);
    return () => clearInterval(iv);
  }, [started, target, duration]);

  return { count, ref };
};

/* ── Stat component ── */
interface StatProps { value: number; prefix?: string; suffix?: string; label: string; }
const Stat: React.FC<StatProps> = ({ value, prefix = '', suffix = '', label }) => {
  const { count, ref } = useCountUp(value);
  return (
    <div className={styles.stat} ref={ref}>
      <span className={styles.statValue}>{prefix}{count}{suffix}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
};

/* ── Home ── */
export const Home: React.FC = () => {
  const { displayed, done } = useTypewriter(TAGLINE);

  return (
    <div className={styles.hero}>
      <div className={styles.heroTop}>
        <div className={styles.heroText}>
          <span className={styles.greeting}>Hello, world —</span>

          <div className={styles.nameBlock}>
            <span className={styles.firstName}>{data.name.first}</span>
            <span className={styles.lastName}>{data.name.last}</span>
          </div>

          <p className={styles.tagline}>
            {displayed}
            {!done && <span className={styles.cursor}>|</span>}
          </p>

          <div className={styles.cta}>
            <a
              href={data['social-media'].find(s => s.icon === 'linkedin')?.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnPrimary}
            >
              Connect on LinkedIn
            </a>
            <a
              href={data['social-media'].find(s => s.icon === 'github')?.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.btnSecondary}
            >
              GitHub
            </a>
          </div>
        </div>

        <div className={styles.photoWrapper}>
          <img src={pic} alt={`${data.name.first} ${data.name.last}`} />
        </div>
      </div>

      <div className={styles.divider} />

      <div className={styles.about}>
        <span className={styles.aboutLabel}>About</span>
        <p className={styles.aboutText}>{data.about}</p>
      </div>

      <div className={styles.statsRow}>
        <Stat value={7}  suffix="+" label="Years experience" />
        <Stat value={2}  label="Companies" />
        <Stat value={40} prefix="~" suffix="k" label="Tests automated" />
      </div>

      <div className={styles.techStack}>
        <span className={styles.techLabel}>Core tech</span>
        <div className={styles.techTags}>
          {TOP_TECH.map((t) => (
            <span key={t} className={styles.techTag}>{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
};
