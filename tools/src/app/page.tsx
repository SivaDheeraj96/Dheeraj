'use client';

import Link from 'next/link';

const tools = [
  {
    category: 'Text & Encoding',
    color: '#6366f1',
    items: [
      { label: 'JSON Formatter', href: '/tools/json-formatter', desc: 'Format, validate and minify JSON', icon: '{ }' },
      { label: 'Base64', href: '/tools/base64', desc: 'Encode and decode Base64 strings', icon: '64' },
      { label: 'URL Encode/Decode', href: '/tools/url-encode', desc: 'Encode/decode URL components', icon: 'URL' },
      { label: 'HTML Entities', href: '/tools/html-entities', desc: 'Escape and unescape HTML entities', icon: '<>' },
      { label: 'JWT Decoder', href: '/tools/jwt-decoder', desc: 'Decode and inspect JWT tokens', icon: 'JWT' },
    ],
  },
  {
    category: 'Crypto & Security',
    color: '#8b5cf6',
    items: [
      { label: 'Hash Generator', href: '/tools/hash', desc: 'Generate MD5, SHA-256, SHA-512 hashes', icon: '#' },
      { label: 'Password Generator', href: '/tools/password', desc: 'Generate secure random passwords', icon: '🔑' },
      { label: 'UUID Generator', href: '/tools/uuid', desc: 'Generate v4 UUIDs instantly', icon: 'UID' },
    ],
  },
  {
    category: 'Numbers & Data',
    color: '#06b6d4',
    items: [
      { label: 'Number Base Converter', href: '/tools/base-converter', desc: 'Convert between Decimal, Hex, Binary, Octal', icon: '0x' },
      { label: 'Unix Timestamp', href: '/tools/timestamp', desc: 'Convert epoch timestamps to dates', icon: '⏱' },
    ],
  },
  {
    category: 'Text Tools',
    color: '#f59e0b',
    items: [
      { label: 'Case Converter', href: '/tools/case-converter', desc: 'camelCase, snake_case, PascalCase and more', icon: 'Aa' },
      { label: 'Word Counter', href: '/tools/word-counter', desc: 'Count words, characters, lines and sentences', icon: 'W' },
      { label: 'Regex Tester', href: '/tools/regex', desc: 'Test regular expressions with live highlighting', icon: '.*' },
    ],
  },
  {
    category: 'Color & Design',
    color: '#ec4899',
    items: [
      { label: 'Color Converter', href: '/tools/color', desc: 'Convert between HEX, RGB, HSL and more', icon: '🎨' },
    ],
  },
];

export default function Home() {
  const totalTools = tools.reduce((sum, g) => sum + g.items.length, 0);

  return (
    <div style={{ padding: '40px 32px', maxWidth: 960, margin: '0 auto' }}>
      <div style={{ marginBottom: 48, textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.3)',
            borderRadius: 20,
            padding: '4px 14px',
            fontSize: 12,
            color: '#818cf8',
            fontWeight: 600,
            marginBottom: 20,
          }}
        >
          ⚡ {totalTools} tools — all client-side, no server
        </div>
        <h1
          style={{
            fontSize: 42,
            fontWeight: 800,
            margin: 0,
            marginBottom: 14,
            background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            lineHeight: 1.2,
          }}
        >
          Developer Utilities
        </h1>
        <p style={{ color: 'var(--muted)', fontSize: 16, margin: 0, lineHeight: 1.6 }}>
          Fast, free online tools for developers. Everything runs in your browser —<br />
          no data ever leaves your device.
        </p>
      </div>

      {tools.map((group) => (
        <div key={group.category} style={{ marginBottom: 40 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: 4,
                height: 18,
                borderRadius: 4,
                background: group.color,
              }}
            />
            <h2 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: '#cbd5e1', letterSpacing: '0.03em' }}>
              {group.category}
            </h2>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 14,
            }}
          >
            {group.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                style={{ textDecoration: 'none' }}
              >
                <div
                  style={{
                    background: 'var(--card)',
                    border: '1px solid var(--card-border)',
                    borderRadius: 12,
                    padding: '18px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    height: '100%',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = group.color;
                    (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 24px rgba(0,0,0,0.3)`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--card-border)';
                    (e.currentTarget as HTMLDivElement).style.transform = '';
                    (e.currentTarget as HTMLDivElement).style.boxShadow = '';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 9,
                        background: `${group.color}20`,
                        border: `1px solid ${group.color}40`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 13,
                        fontWeight: 800,
                        color: group.color,
                        fontFamily: 'monospace',
                        flexShrink: 0,
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>{item.label}</div>
                  </div>
                  <div style={{ fontSize: 12.5, color: 'var(--muted)', lineHeight: 1.5 }}>{item.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
