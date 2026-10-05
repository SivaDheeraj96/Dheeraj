'use client';

import { useState, useMemo } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Input, Textarea, Row, Badge } from '@/components/ui';

const PRESETS = [
  { label: 'Email', pattern: '[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}', flags: 'g' },
  { label: 'URL', pattern: 'https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)', flags: 'gi' },
  { label: 'IPv4', pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
  { label: 'Phone (US)', pattern: '\\(?\\d{3}\\)?[\\s.\\-]?\\d{3}[\\s.\\-]?\\d{4}', flags: 'g' },
  { label: 'Hex Color', pattern: '#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})\\b', flags: 'g' },
  { label: 'Date (YYYY-MM-DD)', pattern: '\\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\\d|3[01])', flags: 'g' },
  { label: 'HTML Tag', pattern: '<[^>]+>', flags: 'g' },
  { label: 'Integer', pattern: '-?\\b\\d+\\b', flags: 'g' },
];

export default function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState('');

  const result = useMemo(() => {
    if (!pattern || !testString) return null;
    try {
      const re = new RegExp(pattern, flags);
      setError('');
      const matches: { match: string; index: number; groups: Record<string, string> | undefined }[] = [];
      let m;
      const globalRe = flags.includes('g') ? re : new RegExp(pattern, flags + 'g');
      while ((m = globalRe.exec(testString)) !== null) {
        matches.push({ match: m[0], index: m.index, groups: m.groups });
        if (!flags.includes('g')) break;
      }
      return { matches, count: matches.length };
    } catch (e: unknown) {
      setError((e as Error).message);
      return null;
    }
  }, [pattern, flags, testString]);

  const highlighted = useMemo(() => {
    if (!result || result.matches.length === 0) return testString;
    const ranges = result.matches.map((m) => ({ start: m.index, end: m.index + m.match.length }));
    let output = '';
    let pos = 0;
    for (const range of ranges) {
      output += testString.slice(pos, range.start).replace(/</g, '&lt;').replace(/>/g, '&gt;');
      output += `<mark style="background:#4f46e5;color:#fff;border-radius:3px;padding:0 2px">${testString.slice(range.start, range.end).replace(/</g, '&lt;').replace(/>/g, '&gt;')}</mark>`;
      pos = range.end;
    }
    output += testString.slice(pos).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return output;
  }, [result, testString]);

  const flagList = ['g', 'i', 'm', 's', 'u'];

  const toggleFlag = (f: string) => {
    setFlags((prev) => prev.includes(f) ? prev.replace(f, '') : prev + f);
  };

  return (
    <ToolLayout
      title="Regex Tester"
      description="Test regular expressions with live match highlighting. Supports all JavaScript regex flags."
    >
      <Card style={{ marginBottom: 16 }}>
        <Label>Presets</Label>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 0 }}>
          {PRESETS.map((p) => (
            <button
              key={p.label}
              onClick={() => { setPattern(p.pattern); setFlags(p.flags); }}
              style={{
                background: 'var(--muted-bg)',
                border: '1px solid var(--card-border)',
                borderRadius: 6,
                padding: '4px 12px',
                color: '#94a3b8',
                fontSize: 12,
                cursor: 'pointer',
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
      </Card>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <Label>Regular Expression</Label>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ padding: '10px 10px', background: '#141420', border: '1px solid var(--card-border)', borderRight: 'none', borderRadius: '8px 0 0 8px', color: '#6366f1', fontFamily: 'monospace', fontSize: 14 }}>/</div>
              <Input
                value={pattern}
                onChange={setPattern}
                placeholder="your regex pattern here"
                style={{ borderRadius: 0, borderLeft: 'none', borderRight: 'none' }}
              />
              <div style={{ padding: '10px 10px', background: '#141420', border: '1px solid var(--card-border)', borderLeft: 'none', borderRadius: '0 8px 8px 0', color: '#6366f1', fontFamily: 'monospace', fontSize: 14 }}>/{flags}</div>
            </div>
          </div>
          <div style={{ flexShrink: 0 }}>
            <Label>Flags</Label>
            <div style={{ display: 'flex', gap: 4 }}>
              {flagList.map((f) => (
                <button
                  key={f}
                  onClick={() => toggleFlag(f)}
                  style={{
                    width: 32,
                    height: 38,
                    borderRadius: 8,
                    border: `1px solid ${flags.includes(f) ? '#6366f1' : 'var(--card-border)'}`,
                    background: flags.includes(f) ? 'rgba(99,102,241,0.2)' : 'var(--muted-bg)',
                    color: flags.includes(f) ? '#818cf8' : '#64748b',
                    fontFamily: 'monospace',
                    fontSize: 13,
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div style={{ marginBottom: 12, padding: '8px 12px', borderRadius: 7, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#ef4444', fontSize: 12, fontFamily: 'monospace' }}>
            {error}
          </div>
        )}

        <Row style={{ marginBottom: 8, justifyContent: 'space-between' }}>
          <Label>Test String</Label>
          {result !== null && (
            result.count > 0
              ? <Badge color="green">{result.count} match{result.count !== 1 ? 'es' : ''}</Badge>
              : <Badge color="red">No matches</Badge>
          )}
        </Row>
        <Textarea
          value={testString}
          onChange={setTestString}
          placeholder="Enter your test string here..."
          rows={6}
          fontMono={false}
        />
      </Card>

      {testString && result && result.matches.length > 0 && (
        <>
          <Card style={{ marginBottom: 16 }}>
            <Label>Highlighted Matches</Label>
            <div
              dangerouslySetInnerHTML={{ __html: highlighted }}
              style={{
                fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                fontSize: 13,
                background: 'var(--muted-bg)',
                borderRadius: 8,
                padding: '12px 14px',
                lineHeight: 1.8,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                marginTop: 8,
                color: '#94a3b8',
              }}
            />
          </Card>

          <Card>
            <Label>Match Details</Label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {result.matches.map((m, i) => (
                <div key={i} style={{ background: 'var(--muted-bg)', borderRadius: 8, padding: '10px 14px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <Badge color="blue">#{i + 1}</Badge>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0', marginBottom: 4 }}>{m.match}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      Index: {m.index}–{m.index + m.match.length}
                      {m.groups && Object.keys(m.groups).length > 0 && (
                        <span style={{ marginLeft: 12 }}>
                          Groups: {JSON.stringify(m.groups)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </ToolLayout>
  );
}
