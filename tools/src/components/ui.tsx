'use client';

import React from 'react';

const cardStyle: React.CSSProperties = {
  background: 'var(--card)',
  border: '1px solid var(--card-border)',
  borderRadius: 12,
  padding: 20,
};

export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ ...cardStyle, ...style }}>{children}</div>;
}

export function Label({ children }: { children: React.ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'var(--muted)', marginBottom: 8, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
      {children}
    </label>
  );
}

export function Textarea({
  value,
  onChange,
  placeholder,
  rows = 8,
  readOnly,
  style,
  fontMono = true,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  rows?: number;
  readOnly?: boolean;
  style?: React.CSSProperties;
  fontMono?: boolean;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      readOnly={readOnly}
      style={{
        width: '100%',
        background: 'var(--muted-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 8,
        padding: '12px 14px',
        color: '#e2e8f0',
        fontSize: 13,
        fontFamily: fontMono ? 'ui-monospace, SFMono-Regular, Menlo, monospace' : 'inherit',
        resize: 'vertical',
        lineHeight: 1.6,
        transition: 'border-color 0.15s',
        ...style,
      }}
    />
  );
}

export function Input({
  value,
  onChange,
  placeholder,
  type = 'text',
  style,
}: {
  value: string;
  onChange?: (v: string) => void;
  placeholder?: string;
  type?: string;
  style?: React.CSSProperties;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      style={{
        width: '100%',
        background: 'var(--muted-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 8,
        padding: '10px 14px',
        color: '#e2e8f0',
        fontSize: 13,
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
        transition: 'border-color 0.15s',
        ...style,
      }}
    />
  );
}

export function Button({
  children,
  onClick,
  variant = 'primary',
  style,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  style?: React.CSSProperties;
  disabled?: boolean;
}) {
  const variants: Record<string, React.CSSProperties> = {
    primary: { background: '#6366f1', color: '#fff', border: '1px solid #6366f1' },
    secondary: { background: 'var(--muted-bg)', color: '#94a3b8', border: '1px solid var(--card-border)' },
    danger: { background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' },
    ghost: { background: 'transparent', color: '#94a3b8', border: '1px solid var(--card-border)' },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'all 0.15s',
        whiteSpace: 'nowrap',
        ...variants[variant],
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function Badge({ children, color = 'blue' }: { children: React.ReactNode; color?: 'blue' | 'green' | 'red' | 'gray' }) {
  const colors = {
    blue: { bg: 'rgba(99,102,241,0.15)', color: '#818cf8' },
    green: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e' },
    red: { bg: 'rgba(239,68,68,0.15)', color: '#ef4444' },
    gray: { bg: 'rgba(148,163,184,0.1)', color: '#94a3b8' },
  };
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '2px 9px', borderRadius: 20, fontSize: 11, fontWeight: 600, ...colors[color] }}>
      {children}
    </span>
  );
}

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <Button onClick={copy} variant="secondary" style={{ fontSize: 12, padding: '5px 12px' }}>
      {copied ? '✓ Copied' : 'Copy'}
    </Button>
  );
}

export function Select({
  value,
  onChange,
  options,
  style,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { label: string; value: string }[];
  style?: React.CSSProperties;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: 'var(--muted-bg)',
        border: '1px solid var(--card-border)',
        borderRadius: 8,
        padding: '8px 12px',
        color: '#e2e8f0',
        fontSize: 13,
        cursor: 'pointer',
        ...style,
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function Divider() {
  return <div style={{ height: 1, background: 'var(--card-border)', margin: '16px 0' }} />;
}

export function Row({ children, gap = 12, style }: { children: React.ReactNode; gap?: number; style?: React.CSSProperties }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap, flexWrap: 'wrap', ...style }}>
      {children}
    </div>
  );
}
