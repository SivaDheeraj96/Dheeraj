import React from 'react';
import data from '../data/info.json';
import styles from './skills.module.scss';

export const Skills: React.FC = () => {
  return (
    <div className={styles.section}>
      <h2 className={styles.heading}>Skills</h2>
      <div className={styles.groups}>
        {data.skills.map((group) => (
          <div key={group.name} className={styles.group}>
            <span className={styles.groupName}>{group.name}</span>
            <div className={styles.tags}>
              {group.value.map((skill) => (
                <span key={skill} className={styles.tag}>{skill}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
