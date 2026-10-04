'use client';

import { useState, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Button, Row, CopyButton } from '@/components/ui';

function generatePassword(length: number, opts: {
  upper: boolean; lower: boolean; numbers: boolean; symbols: boolean; excludeAmbiguous: boolean;
}) {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
  const ambiguous = /[0OIl1]/g;

  let chars = '';
  if (opts.upper) chars += upper;
  if (opts.lower) chars += lower;
  if (opts.numbers) chars += numbers;
  if (opts.symbols) chars += symbols;
  if (opts.excludeAmbiguous) chars = chars.replace(ambiguous, '');
  if (!chars) return '';

  const arr = new Uint8Array(length);
  crypto.getRandomValues(arr);
  return Array.from(arr).map((b) => chars[b % chars.length]).join('');
}

function getStrength(password: string): { label: string; color: string; score: number } {
  if (!password) return { label: '', color: '#3d3d5c', score: 0 };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (password.length >= 16) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 2) return { label: 'Weak', color: '#ef4444', score };
  if (score <= 4) return { label: 'Fair', color: '#f59e0b', score };
  if (score <= 5) return { label: 'Good', color: '#3b82f6', score };
  return { label: 'Strong', color: '#22c55e', score };
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [opts, setOpts] = useState({
    upper: true,
    lower: true,
    numbers: true,
    symbols: true,
    excludeAmbiguous: false,
  });
  const [passwords, setPasswords] = useState<string[]>([]);
  const [count, setCount] = useState(5);

  const generate = useCallback(() => {
    const results = Array.from({ length: count }, () => generatePassword(length, opts));
    setPasswords(results);
  }, [length, opts, count]);

  const toggle = (key: keyof typeof opts) => setOpts((prev) => ({ ...prev, [key]: !prev[key] }));

  const CheckBox = ({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) => (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        cursor: 'pointer',
        fontSize: 13,
        color: checked ? '#e2e8f0' : '#64748b',
        userSelect: 'none',
      }}
    >
      <div
        onClick={onChange}
        style={{
          width: 18,
          height: 18,
          borderRadius: 4,
          border: `2px solid ${checked ? '#6366f1' : '#3d3d5c'}`,
          background: checked ? '#6366f1' : 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          cursor: 'pointer',
          transition: 'all 0.15s',
        }}
      >
        {checked && <span style={{ color: '#fff', fontSize: 11, fontWeight: 700 }}>✓</span>}
      </div>
      {label}
    </label>
  );

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate cryptographically secure random passwords using the Web Crypto API."
    >
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
          <div>
            <Label>Password Length: {length}</Label>
            <input
              type="range"
              min={4}
              max={128}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer', marginBottom: 8 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
              <span>4</span><span>128</span>
            </div>
          </div>
          <div>
            <Label>Number of Passwords: {count}</Label>
            <input
              type="range"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer', marginBottom: 8 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
              <span>1</span><span>20</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10, marginTop: 20, marginBottom: 20 }}>
          <CheckBox label="Uppercase (A-Z)" checked={opts.upper} onChange={() => toggle('upper')} />
          <CheckBox label="Lowercase (a-z)" checked={opts.lower} onChange={() => toggle('lower')} />
          <CheckBox label="Numbers (0-9)" checked={opts.numbers} onChange={() => toggle('numbers')} />
          <CheckBox label="Symbols (!@#...)" checked={opts.symbols} onChange={() => toggle('symbols')} />
          <CheckBox label="Exclude Ambiguous (0,O,I,l,1)" checked={opts.excludeAmbiguous} onChange={() => toggle('excludeAmbiguous')} />
        </div>

        <Button onClick={generate}>Generate Passwords</Button>
      </Card>

      {passwords.length > 0 && (
        <Card>
          <Label>Generated Passwords</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
            {passwords.map((pw, i) => {
              const strength = getStrength(pw);
              return (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    background: 'var(--muted-bg)',
                    borderRadius: 8,
                    padding: '10px 14px',
                    border: '1px solid var(--card-border)',
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                      fontSize: 14,
                      color: '#e2e8f0',
                      letterSpacing: '0.05em',
                      wordBreak: 'break-all',
                    }}
                  >
                    {pw}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, fontWeight: 600, color: strength.color }}>{strength.label}</span>
                    <div style={{ display: 'flex', gap: 2 }}>
                      {[1, 2, 3, 4].map((bar) => (
                        <div
                          key={bar}
                          style={{
                            width: 6,
                            height: 18,
                            borderRadius: 3,
                            background: strength.score >= bar * 1.75 ? strength.color : '#2d2d3d',
                          }}
                        />
                      ))}
                    </div>
                    <CopyButton text={pw} />
                  </div>
                </div>
              );
            })}
          </div>
          <Button
            onClick={() => {
              const all = passwords.join('\n');
              navigator.clipboard.writeText(all);
            }}
            variant="secondary"
            style={{ marginTop: 12, fontSize: 12 }}
          >
            Copy All
          </Button>
        </Card>
      )}
    </ToolLayout>
  );
}
