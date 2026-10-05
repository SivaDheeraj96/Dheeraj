'use client';

import { useState, useMemo } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Textarea } from '@/components/ui';

function analyze(text: string) {
  const chars = text.length;
  const charsNoSpaces = text.replace(/\s/g, '').length;
  const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const sentences = text.trim() === '' ? 0 : (text.match(/[.!?]+/g) || []).length;
  const paragraphs = text.trim() === '' ? 0 : text.split(/\n\s*\n/).filter((p) => p.trim()).length;
  const lines = text === '' ? 0 : text.split('\n').length;
  const uniqueWords = text.trim() === '' ? 0 : new Set(
    text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean)
  ).size;
  const avgWordLength = words === 0 ? 0 : (charsNoSpaces / words).toFixed(1);
  const readingTime = Math.max(1, Math.round(words / 200));
  const speakingTime = Math.max(1, Math.round(words / 130));
  return { chars, charsNoSpaces, words, sentences, paragraphs, lines, uniqueWords, avgWordLength, readingTime, speakingTime };
}

function getFrequency(text: string): [string, number][] {
  if (!text.trim()) return [];
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/).filter(Boolean);
  const freq: Record<string, number> = {};
  for (const w of words) freq[w] = (freq[w] || 0) + 1;
  return Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10);
}

export default function WordCounter() {
  const [input, setInput] = useState('');

  const stats = useMemo(() => analyze(input), [input]);
  const freq = useMemo(() => getFrequency(input), [input]);

  const statItems = [
    { label: 'Words', value: stats.words, color: '#6366f1' },
    { label: 'Characters', value: stats.chars, color: '#8b5cf6' },
    { label: 'Chars (no spaces)', value: stats.charsNoSpaces, color: '#06b6d4' },
    { label: 'Sentences', value: stats.sentences, color: '#f59e0b' },
    { label: 'Paragraphs', value: stats.paragraphs, color: '#ec4899' },
    { label: 'Lines', value: stats.lines, color: '#10b981' },
    { label: 'Unique Words', value: stats.uniqueWords, color: '#3b82f6' },
    { label: 'Avg Word Length', value: stats.avgWordLength, color: '#84cc16' },
    { label: 'Reading Time', value: `~${stats.readingTime} min`, color: '#f97316' },
    { label: 'Speaking Time', value: `~${stats.speakingTime} min`, color: '#a78bfa' },
  ];

  return (
    <ToolLayout
      title="Word & Character Counter"
      description="Count words, characters, sentences, paragraphs and more. Analyzes in real-time."
    >
      <Card style={{ marginBottom: 16 }}>
        <Label>Input Text</Label>
        <Textarea
          value={input}
          onChange={setInput}
          placeholder="Type or paste your text here..."
          rows={10}
          fontMono={false}
        />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 16 }}>
        {statItems.map(({ label, value, color }) => (
          <Card key={label} style={{ textAlign: 'center', padding: '16px 12px' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color, fontVariantNumeric: 'tabular-nums', marginBottom: 4 }}>
              {value}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600 }}>{label}</div>
          </Card>
        ))}
      </div>

      {freq.length > 0 && (
        <Card>
          <Label>Top 10 Most Frequent Words</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {freq.map(([word, count], i) => {
              const max = freq[0][1];
              const pct = Math.round((count / max) * 100);
              return (
                <div key={word} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ fontSize: 11, color: '#3d3d5c', width: 20, textAlign: 'right', flexShrink: 0 }}>{i + 1}</div>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0', width: 120, flexShrink: 0 }}>{word}</div>
                  <div style={{ flex: 1, background: '#1e1e2e', borderRadius: 4, height: 8, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: '#6366f1', borderRadius: 4, transition: 'width 0.3s' }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', width: 30, textAlign: 'right', flexShrink: 0 }}>{count}</div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </ToolLayout>
  );
}
