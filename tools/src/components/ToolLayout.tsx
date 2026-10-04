import React from 'react';

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 24,
            fontWeight: 700,
            color: '#e2e8f0',
            margin: 0,
            marginBottom: 6,
          }}
        >
          {title}
        </h1>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: 14 }}>{description}</p>
      </div>
      {children}
    </div>
  );
}
