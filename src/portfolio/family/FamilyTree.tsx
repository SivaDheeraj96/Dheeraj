import React, { useLayoutEffect, useRef, useState } from 'react';
import data from '../data/family.json';
import styles from './family.module.scss';

/* ── Types ── */
interface Member {
  id: string;
  name: string;
  birth?: string;
  death?: string;
  gender: 'M' | 'F';
  isMe?: boolean;
}

interface Couple {
  id: string;
  partners: string[];
  children?: string[];
}

interface LayoutCouple {
  couple: Couple;
  generation: number;
  indexInGen: number;
  countInGen: number;
}

/* ── Layout engine ── */
function buildLayout(members: Member[], couples: Couple[]): LayoutCouple[] {
  void members; // used for type inference via callers

  // Map each member to the couple where they appear as a child
  const memberParentCouple = new Map<string, string>();
  couples.forEach(c => c.children?.forEach(cid => memberParentCouple.set(cid, c.id)));

  // Assign generation: couples with no parents-couple ancestry = gen 0
  const coupleGen = new Map<string, number>();
  const assignGen = (coupleId: string, gen: number) => {
    if (coupleGen.has(coupleId) && (coupleGen.get(coupleId) ?? 0) >= gen) return;
    coupleGen.set(coupleId, gen);
    const couple = couples.find(c => c.id === coupleId);
    couple?.children?.forEach(childId => {
      const childCouple = couples.find(c => c.partners.includes(childId));
      if (childCouple) assignGen(childCouple.id, gen + 1);
    });
  };

  const roots = couples.filter(c =>
    !c.partners.some(pid => pid && memberParentCouple.has(pid))
  );
  roots.forEach(c => assignGen(c.id, 0));

  // Fallback: assign remaining couples
  couples.forEach(c => { if (!coupleGen.has(c.id)) coupleGen.set(c.id, 0); });

  // Group by generation
  const byGen = new Map<number, Couple[]>();
  couples.forEach(c => {
    const g = coupleGen.get(c.id) ?? 0;
    if (!byGen.has(g)) byGen.set(g, []);
    byGen.get(g)?.push(c);
  });

  const result: LayoutCouple[] = [];
  byGen.forEach((genCouples, gen) => {
    genCouples.forEach((couple, idx) => {
      result.push({ couple, generation: gen, indexInGen: idx, countInGen: genCouples.length });
    });
  });

  return result;
}

/* ── Connection lines (SVG) ── */
interface CardPos { x: number; y: number; w: number; h: number; }

function ConnectorLines({
  positions,
  couples,
}: {
  positions: Map<string, CardPos>;
  couples: Couple[];
}) {
  const paths: React.ReactNode[] = [];

  couples.forEach(couple => {
    const parentPos = positions.get(couple.id);
    if (!parentPos) return;

    const parentCx = parentPos.x + parentPos.w / 2;
    const parentBottom = parentPos.y + parentPos.h;

    couple.children?.forEach(childId => {
      // Is the child a member card?
      const childMemberPos = positions.get(`m_${childId}`);
      if (childMemberPos) {
        const cx = childMemberPos.x + childMemberPos.w / 2;
        const cy = childMemberPos.y;
        const midY = parentBottom + (cy - parentBottom) / 2;
        paths.push(
          <path
            key={`${couple.id}-${childId}`}
            d={`M ${parentCx} ${parentBottom} C ${parentCx} ${midY}, ${cx} ${midY}, ${cx} ${cy}`}
            fill="none"
            stroke="rgba(0,209,209,0.35)"
            strokeWidth="1.5"
          />
        );
        return;
      }

      // Child is a partner in another couple
      const childCouple = couples.find(c => c.partners.includes(childId));
      if (!childCouple) return;
      const childPos = positions.get(childCouple.id);
      if (!childPos) return;

      const cx = childPos.x + childPos.w / 2;
      const cy = childPos.y;
      const midY = parentBottom + (cy - parentBottom) / 2;
      paths.push(
        <path
          key={`${couple.id}-${childCouple.id}`}
          d={`M ${parentCx} ${parentBottom} C ${parentCx} ${midY}, ${cx} ${midY}, ${cx} ${cy}`}
          fill="none"
          stroke="rgba(0,209,209,0.35)"
          strokeWidth="1.5"
        />
      );
    });
  });

  return <>{paths}</>;
}

/* ── Member card ── */

function MemberCard({ member }: { member: Member }) {
  return (
    <div className={`${styles.memberCard} ${member.isMe ? styles.isMe : ''} ${member.gender === 'F' ? styles.female : ''}`}>
      <div className={styles.memberName}>{member.name}</div>
      {(member.birth || member.death) && (
        <div className={styles.memberDates}>
          {member.birth && <span>{member.birth}</span>}
          {member.death && <span> – {member.death}</span>}
          {member.birth && !member.death && <span> – </span>}
        </div>
      )}
    </div>
  );
}

function CoupleCard({ couple, members }: { couple: Couple; members: Member[] }) {
  const [p1, p2] = couple.partners.map(id => members.find(m => m.id === id)).filter(Boolean) as Member[];
  return (
    <div className={styles.coupleCard}>
      {p1 && <MemberCard member={p1} />}
      {p2 && (
        <>
          <div className={styles.coupleConnector}>
            <div className={styles.coupleLine} />
            <span className={styles.coupleHeart}>♥</span>
            <div className={styles.coupleLine} />
          </div>
          <MemberCard member={p2} />
        </>
      )}
    </div>
  );
}

/* ── Main tree ── */
export const FamilyTree: React.FC = () => {
  const members = data.members as Member[];
  const couples = data.couples as Couple[];

  const layout = buildLayout(members, couples);
  const maxGen = Math.max(...layout.map(l => l.generation));

  // Find single members with no couple (appear only as children, not partners)
  const allPartners = new Set(couples.flatMap(c => c.partners));
  const singleMembers = members.filter(m => !allPartners.has(m.id));

  // Positions map
  const [positions, setPositions] = useState<Map<string, CardPos>>(new Map());
  const [svgSize, setSvgSize] = useState({ w: 0, h: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const newPos = new Map<string, CardPos>();

    cardRefs.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      newPos.set(id, {
        x: r.left - containerRect.left,
        y: r.top - containerRect.top,
        w: r.width,
        h: r.height,
      });
    });

    setPositions(newPos);
    setSvgSize({ w: containerRect.width, h: containerRect.height });
  }, [layout.length]);

  const numGens = maxGen + 1;

  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>{data.title}</h2>
      <p className={styles.subtitle}>
        Edit <code>src/portfolio/data/family.json</code> to add your real family members and relationships.
      </p>

      <div className={styles.treeWrapper}>
        <div className={styles.treeContainer} ref={containerRef}>
          {/* SVG connection layer */}
          {positions.size > 0 && (
            <svg
              className={styles.connectorSvg}
              width={svgSize.w}
              height={svgSize.h}
              style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
            >
              <ConnectorLines positions={positions} couples={couples} />
            </svg>
          )}

          {/* Generation rows */}
          {Array.from({ length: numGens }, (_, gen) => {
            const genCouples = layout.filter(l => l.generation === gen);
            return (
              <div key={gen} className={styles.generationRow}>
                <span className={styles.genLabel}>
                  {gen === 0 ? 'Grandparents' : gen === 1 ? 'Parents' : gen === 2 ? 'Your Generation' : `Generation ${gen + 1}`}
                </span>
                <div className={styles.genCards}>
                  {genCouples.map(({ couple }) => (
                    <div
                      key={couple.id}
                      ref={el => { if (el) cardRefs.current.set(couple.id, el); }}
                    >
                      <CoupleCard couple={couple} members={members} />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Single members (not in any couple) */}
          {singleMembers.length > 0 && (
            <div className={styles.generationRow}>
              <span className={styles.genLabel}>Your Generation</span>
              <div className={styles.genCards}>
                {singleMembers.map(m => (
                  <div
                    key={m.id}
                    ref={el => { if (el) cardRefs.current.set(`m_${m.id}`, el); }}
                  >
                    <MemberCard member={m} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
