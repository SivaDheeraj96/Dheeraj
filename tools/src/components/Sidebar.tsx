'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tools = [
  {
    category: 'Text & Encoding',
    items: [
      { label: 'JSON Formatter', href: '/tools/json-formatter', icon: '{ }' },
      { label: 'Base64', href: '/tools/base64', icon: '64' },
      { label: 'URL Encode/Decode', href: '/tools/url-encode', icon: 'URL' },
      { label: 'HTML Entities', href: '/tools/html-entities', icon: '<>' },
      { label: 'JWT Decoder', href: '/tools/jwt-decoder', icon: 'JWT' },
    ],
  },
  {
    category: 'Crypto & Security',
    items: [
      { label: 'Hash Generator', href: '/tools/hash', icon: '#' },
      { label: 'Password Generator', href: '/tools/password', icon: '🔑' },
      { label: 'UUID Generator', href: '/tools/uuid', icon: 'UID' },
    ],
  },
  {
    category: 'Numbers & Data',
    items: [
      { label: 'Number Base Converter', href: '/tools/base-converter', icon: '0x' },
      { label: 'Unix Timestamp', href: '/tools/timestamp', icon: '⏱' },
    ],
  },
  {
    category: 'Text Tools',
    items: [
      { label: 'Case Converter', href: '/tools/case-converter', icon: 'Aa' },
      { label: 'Word Counter', href: '/tools/word-counter', icon: 'W' },
      { label: 'Regex Tester', href: '/tools/regex', icon: '.*' },
    ],
  },
  {
    category: 'Color & Design',
    items: [
      { label: 'Color Converter', href: '/tools/color', icon: '🎨' },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: 'var(--sidebar-width)',
        minHeight: '100vh',
        background: 'var(--card)',
        borderRight: '1px solid var(--card-border)',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        overflowY: 'auto',
        zIndex: 100,
      }}
    >
      <Link
        href="/"
        style={{ textDecoration: 'none' }}
      >
        <div
          style={{
            padding: '20px 16px 16px',
            borderBottom: '1px solid var(--card-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 8,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 16,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              ⚡
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, color: '#e2e8f0' }}>DevTools</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Online Utilities</div>
            </div>
          </div>
        </div>
      </Link>

      <nav style={{ padding: '12px 8px', flex: 1 }}>
        {tools.map((group) => (
          <div key={group.category} style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                padding: '4px 10px 8px',
              }}
            >
              {group.category}
            </div>
            {group.items.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '7px 10px',
                    borderRadius: 7,
                    textDecoration: 'none',
                    marginBottom: 2,
                    background: active ? 'rgba(99,102,241,0.18)' : 'transparent',
                    color: active ? '#818cf8' : '#94a3b8',
                    fontWeight: active ? 600 : 400,
                    fontSize: 13.5,
                    transition: 'all 0.15s',
                    borderLeft: active ? '3px solid #6366f1' : '3px solid transparent',
                  }}
                >
                  <span
                    style={{
                      width: 26,
                      height: 26,
                      borderRadius: 6,
                      background: active ? 'rgba(99,102,241,0.25)' : 'var(--muted-bg)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 10,
                      fontWeight: 700,
                      color: active ? '#818cf8' : '#64748b',
                      flexShrink: 0,
                      fontFamily: 'monospace',
                    }}
                  >
                    {item.icon}
                  </span>
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div
        style={{
          padding: '12px 16px',
          borderTop: '1px solid var(--card-border)',
          fontSize: 11,
          color: 'var(--muted)',
          textAlign: 'center',
        }}
      >
        All tools run locally in your browser
      </div>
    </aside>
  );
}
