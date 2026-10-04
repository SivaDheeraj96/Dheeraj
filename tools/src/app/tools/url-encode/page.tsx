'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Textarea, Button, Row, CopyButton, Select } from '@/components/ui';

export default function UrlEncode() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [encodeMode, setEncodeMode] = useState('component');

  const encode = () => {
    setMode('encode');
    try {
      const result = encodeMode === 'component'
        ? encodeURIComponent(input)
        : encodeURI(input);
      setOutput(result);
    } catch {
      setOutput('Error encoding URL');
    }
  };

  const decode = () => {
    setMode('decode');
    try {
      const result = encodeMode === 'component'
        ? decodeURIComponent(input)
        : decodeURI(input);
      setOutput(result);
    } catch {
      setOutput('Error: Invalid URL encoding');
    }
  };

  const swap = () => { setInput(output); setOutput(''); };
  const clear = () => { setInput(''); setOutput(''); };

  return (
    <ToolLayout
      title="URL Encode / Decode"
      description="Encode and decode URL components and full URLs. Handles special characters safely."
    >
      <Card style={{ marginBottom: 16 }}>
        <Row style={{ marginBottom: 16, flexWrap: 'wrap' }}>
          <div>
            <Label>Mode</Label>
            <Select
              value={encodeMode}
              onChange={setEncodeMode}
              options={[
                { label: 'encodeURIComponent (query params)', value: 'component' },
                { label: 'encodeURI (full URL)', value: 'uri' },
              ]}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
            <Button onClick={encode}>Encode →</Button>
            <Button onClick={decode} variant="secondary">← Decode</Button>
            <Button onClick={swap} variant="ghost">⇅ Swap</Button>
            <Button onClick={clear} variant="ghost">Clear</Button>
          </div>
        </Row>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <Label>Input</Label>
            <Textarea
              value={input}
              onChange={setInput}
              placeholder="https://example.com/search?q=hello world&lang=en"
              rows={12}
            />
          </div>
          <div>
            <Row style={{ marginBottom: 8, justifyContent: 'space-between' }}>
              <Label>Output ({mode === 'encode' ? 'URL Encoded' : 'Decoded'})</Label>
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
          <strong style={{ color: '#94a3b8' }}>Difference between modes:</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            <li><strong style={{ color: '#94a3b8' }}>encodeURIComponent</strong> — encodes everything except A-Z a-z 0-9 - _ . ! ~ * &apos; ( ). Use for query parameters.</li>
            <li><strong style={{ color: '#94a3b8' }}>encodeURI</strong> — encodes everything except valid URI characters. Use for full URLs.</li>
          </ul>
        </div>
      </Card>
    </ToolLayout>
  );
}
