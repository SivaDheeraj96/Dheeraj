'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Button, Row, CopyButton } from '@/components/ui';

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function UuidGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(10);
  const [uppercase, setUppercase] = useState(false);
  const [noDashes, setNoDashes] = useState(false);

  const generate = () => {
    const results = Array.from({ length: count }, () => {
      let u = generateUUID();
      if (noDashes) u = u.replace(/-/g, '');
      if (uppercase) u = u.toUpperCase();
      return u;
    });
    setUuids(results);
  };

  const formatUuid = (u: string) => {
    let result = u;
    if (noDashes) result = result.replace(/-/g, '');
    if (uppercase) result = result.toUpperCase();
    return result;
  };

  return (
    <ToolLayout
      title="UUID Generator"
      description="Generate cryptographically random UUID v4 identifiers using the Web Crypto API."
    >
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginBottom: 20 }}>
          <div>
            <Label>Count: {count}</Label>
            <input
              type="range"
              min={1}
              max={50}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              style={{ width: '100%', accentColor: '#6366f1', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)', marginTop: 4 }}>
              <span>1</span><span>50</span>
            </div>
          </div>
          <div>
            <Label>Format</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#94a3b8' }}>
                <input
                  type="checkbox"
                  checked={uppercase}
                  onChange={(e) => setUppercase(e.target.checked)}
                  style={{ accentColor: '#6366f1' }}
                />
                Uppercase
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, color: '#94a3b8' }}>
                <input
                  type="checkbox"
                  checked={noDashes}
                  onChange={(e) => setNoDashes(e.target.checked)}
                  style={{ accentColor: '#6366f1' }}
                />
                Remove dashes
              </label>
            </div>
          </div>
          <div>
            <Label>Preview</Label>
            <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#a5b4fc', wordBreak: 'break-all' }}>
              {formatUuid('550e8400-e29b-41d4-a716-446655440000')}
            </div>
          </div>
        </div>

        <Button onClick={generate}>Generate UUIDs</Button>
      </Card>

      {uuids.length > 0 && (
        <Card>
          <Row style={{ marginBottom: 12, justifyContent: 'space-between' }}>
            <Label>{uuids.length} UUID{uuids.length > 1 ? 's' : ''} Generated</Label>
            <Row gap={8}>
              <Button onClick={generate} variant="secondary" style={{ fontSize: 12 }}>Regenerate</Button>
              <CopyButton text={uuids.join('\n')} />
            </Row>
          </Row>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 6,
              maxHeight: 400,
              overflowY: 'auto',
            }}
          >
            {uuids.map((uuid, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  background: 'var(--muted-bg)',
                  borderRadius: 7,
                  padding: '8px 14px',
                  border: '1px solid var(--card-border)',
                }}
              >
                <span style={{ fontSize: 11, color: '#3d3d5c', fontFamily: 'monospace', width: 22, flexShrink: 0, textAlign: 'right' }}>
                  {i + 1}
                </span>
                <span style={{ flex: 1, fontFamily: 'monospace', fontSize: 13, color: '#a5b4fc', letterSpacing: '0.03em' }}>
                  {uuid}
                </span>
                <CopyButton text={uuid} />
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card style={{ marginTop: 16 }}>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
          <strong style={{ color: '#94a3b8' }}>UUID v4:</strong> Randomly generated 128-bit identifiers.
          The probability of a collision is astronomically low (1 in 5.3 × 10³⁶).
          Format: <code style={{ fontFamily: 'monospace', color: '#a5b4fc' }}>xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx</code>
        </div>
      </Card>
    </ToolLayout>
  );
}
