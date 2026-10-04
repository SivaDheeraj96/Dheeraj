'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Textarea, Button, Row, CopyButton } from '@/components/ui';

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescapeHtml(text: string): string {
  const doc = new DOMParser().parseFromString(text, 'text/html');
  return doc.documentElement.textContent ?? '';
}

export default function HtmlEntities() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape');

  const escape = () => {
    setMode('escape');
    setOutput(escapeHtml(input));
  };

  const unescape = () => {
    setMode('unescape');
    setOutput(unescapeHtml(input));
  };

  const swap = () => { setInput(output); setOutput(''); };
  const clear = () => { setInput(''); setOutput(''); };

  const examples = [
    { label: '<script>alert(1)</script>', action: () => setInput('<script>alert(1)</script>') },
    { label: '&lt;b&gt;Bold&lt;/b&gt;', action: () => setInput('&lt;b&gt;Bold&lt;/b&gt;') },
    { label: 'Tom & Jerry © 2024 ™', action: () => setInput('Tom & Jerry © 2024 ™') },
  ];

  return (
    <ToolLayout
      title="HTML Entity Encode / Decode"
      description="Escape special characters to HTML entities and unescape them back to plain text."
    >
      <Card style={{ marginBottom: 16 }}>
        <Row style={{ marginBottom: 12, flexWrap: 'wrap' }}>
          <Button onClick={escape}>Escape →</Button>
          <Button onClick={unescape} variant="secondary">← Unescape</Button>
          <Button onClick={swap} variant="ghost">⇅ Swap</Button>
          <Button onClick={clear} variant="ghost">Clear</Button>
        </Row>

        <Row style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12, color: 'var(--muted)', marginRight: 4 }}>Examples:</span>
          {examples.map((ex) => (
            <button
              key={ex.label}
              onClick={ex.action}
              style={{
                background: 'var(--muted-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 6,
                padding: '3px 10px',
                color: '#94a3b8',
                fontSize: 11,
                cursor: 'pointer',
                fontFamily: 'monospace',
              }}
            >
              {ex.label}
            </button>
          ))}
        </Row>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <Label>Input</Label>
            <Textarea
              value={input}
              onChange={setInput}
              placeholder={'<h1>Hello "World"</h1>\n<script>alert(\'xss\')</script>'}
              rows={12}
            />
          </div>
          <div>
            <Row style={{ marginBottom: 8, justifyContent: 'space-between' }}>
              <Label>Output ({mode === 'escape' ? 'HTML Escaped' : 'Unescaped'})</Label>
              {output && <CopyButton text={output} />}
            </Row>
            <Textarea
              value={output}
              readOnly
              placeholder="Result will appear here..."
              rows={12}
              style={{ background: '#141420' }}
            />
          </div>
        </div>
      </Card>

      <Card>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
          <strong style={{ color: '#94a3b8' }}>Common entities:</strong>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginTop: 10 }}>
            {[
              ['&', '&amp;'], ['<', '&lt;'], ['>', '&gt;'], ['"', '&quot;'],
              ["'", '&#39;'], ['©', '&copy;'], ['®', '&reg;'], ['™', '&trade;'],
              ['€', '&euro;'], ['£', '&pound;'], ['¥', '&yen;'], ['→', '&rarr;'],
            ].map(([char, entity]) => (
              <div key={char} style={{ background: 'var(--muted-bg)', borderRadius: 6, padding: '6px 10px', fontSize: 12 }}>
                <span style={{ color: '#e2e8f0', fontFamily: 'monospace' }}>{char}</span>
                <span style={{ color: 'var(--muted)', marginLeft: 8 }}>{entity}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </ToolLayout>
  );
}
