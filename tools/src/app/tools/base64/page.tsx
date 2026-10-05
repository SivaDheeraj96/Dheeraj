'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Textarea, Button, Row, CopyButton } from '@/components/ui';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const encode = () => {
    setMode('encode');
    setError('');
    try {
      setOutput(btoa(unescape(encodeURIComponent(input))));
    } catch {
      setError('Failed to encode. Input may contain invalid characters.');
      setOutput('');
    }
  };

  const decode = () => {
    setMode('decode');
    setError('');
    try {
      setOutput(decodeURIComponent(escape(atob(input.trim()))));
    } catch {
      setError('Invalid Base64 string. Please check your input.');
      setOutput('');
    }
  };

  const swap = () => {
    setInput(output);
    setOutput('');
    setError('');
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError('');
  };

  return (
    <ToolLayout
      title="Base64 Encode / Decode"
      description="Encode text to Base64 or decode Base64 back to plain text. Supports Unicode."
    >
      <Card style={{ marginBottom: 16 }}>
        <Row style={{ marginBottom: 16 }}>
          <Button onClick={encode}>Encode →</Button>
          <Button onClick={decode} variant="secondary">← Decode</Button>
          <Button onClick={swap} variant="ghost">⇅ Swap</Button>
          <Button onClick={clear} variant="ghost">Clear</Button>
        </Row>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <Label>Input</Label>
            <Textarea
              value={input}
              onChange={setInput}
              placeholder="Enter text to encode or Base64 to decode..."
              rows={12}
            />
          </div>
          <div>
            <Row style={{ marginBottom: 8, justifyContent: 'space-between' }}>
              <Label>Output ({mode === 'encode' ? 'Base64' : 'Plain Text'})</Label>
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

        {error && (
          <div
            style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.25)',
              color: '#ef4444',
              fontSize: 13,
            }}
          >
            {error}
          </div>
        )}
      </Card>

      <Card>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
          <strong style={{ color: '#94a3b8' }}>About Base64:</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            <li>Base64 encodes binary data as ASCII text using 64 printable characters</li>
            <li>Commonly used for embedding images in CSS/HTML, storing data in JSON, and email attachments</li>
            <li>Every 3 bytes of input produces 4 characters of output (~33% size increase)</li>
          </ul>
        </div>
      </Card>
    </ToolLayout>
  );
}
