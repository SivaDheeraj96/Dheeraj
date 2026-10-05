'use client';

import { useState, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Textarea, Button, Row, Badge, CopyButton, Select } from '@/components/ui';

type ValidationState = 'idle' | 'valid' | 'invalid';

export default function JsonFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [validation, setValidation] = useState<ValidationState>('idle');
  const [error, setError] = useState('');
  const [indent, setIndent] = useState('2');

  const format = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, parseInt(indent)));
      setValidation('valid');
      setError('');
    } catch (e: unknown) {
      setValidation('invalid');
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, indent]);

  const minify = useCallback(() => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setValidation('valid');
      setError('');
    } catch (e: unknown) {
      setValidation('invalid');
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  const clear = () => {
    setInput('');
    setOutput('');
    setValidation('idle');
    setError('');
  };

  return (
    <ToolLayout
      title="JSON Formatter & Validator"
      description="Format, beautify, minify and validate JSON. Runs entirely in your browser."
    >
      <Card style={{ marginBottom: 16 }}>
        <Row style={{ marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <Label>Indent Size</Label>
            <Select
              value={indent}
              onChange={setIndent}
              options={[
                { label: '2 spaces', value: '2' },
                { label: '4 spaces', value: '4' },
                { label: 'Tab', value: '\t' },
              ]}
            />
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 22 }}>
            <Button onClick={format}>Format</Button>
            <Button onClick={minify} variant="secondary">Minify</Button>
            <Button onClick={clear} variant="ghost">Clear</Button>
          </div>
          {validation !== 'idle' && (
            <div style={{ marginTop: 22 }}>
              {validation === 'valid' ? (
                <Badge color="green">✓ Valid JSON</Badge>
              ) : (
                <Badge color="red">✗ Invalid JSON</Badge>
              )}
            </div>
          )}
        </Row>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <Label>Input JSON</Label>
            <Textarea
              value={input}
              onChange={setInput}
              placeholder='Paste your JSON here...\n{\n  "name": "example"\n}'
              rows={16}
            />
          </div>
          <div>
            <Row style={{ marginBottom: 8, justifyContent: 'space-between' }}>
              <Label>Output</Label>
              {output && <CopyButton text={output} />}
            </Row>
            <Textarea
              value={output}
              readOnly
              placeholder="Formatted JSON will appear here..."
              rows={16}
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
              fontFamily: 'monospace',
            }}
          >
            {error}
          </div>
        )}
      </Card>

      <Card>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
          <strong style={{ color: '#94a3b8' }}>Tips:</strong>
          <ul style={{ margin: '8px 0 0', paddingLeft: 20 }}>
            <li>Paste any JSON and click <strong>Format</strong> to pretty-print it</li>
            <li>Use <strong>Minify</strong> to remove all whitespace for production use</li>
            <li>Invalid JSON will show a red badge with the error location</li>
          </ul>
        </div>
      </Card>
    </ToolLayout>
  );
}
