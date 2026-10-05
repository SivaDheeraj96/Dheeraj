'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Textarea, Button, Row, Badge } from '@/components/ui';

function base64UrlDecode(str: string): string {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  return decodeURIComponent(
    atob(padded)
      .split('')
      .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
}

function formatJson(obj: unknown): string {
  return JSON.stringify(obj, null, 2);
}

interface DecodedJwt {
  header: Record<string, unknown>;
  payload: Record<string, unknown>;
  signature: string;
}

function isExpired(payload: Record<string, unknown>): boolean | null {
  if (!payload.exp) return null;
  return Date.now() / 1000 > (payload.exp as number);
}

export default function JwtDecoder() {
  const [input, setInput] = useState('');
  const [decoded, setDecoded] = useState<DecodedJwt | null>(null);
  const [error, setError] = useState('');

  const decode = () => {
    setError('');
    setDecoded(null);
    const token = input.trim();
    const parts = token.split('.');
    if (parts.length !== 3) {
      setError('Invalid JWT: must have exactly 3 parts separated by dots');
      return;
    }
    try {
      const header = JSON.parse(base64UrlDecode(parts[0]));
      const payload = JSON.parse(base64UrlDecode(parts[1]));
      setDecoded({ header, payload, signature: parts[2] });
    } catch {
      setError('Failed to decode JWT. Make sure it is a valid token.');
    }
  };

  const clear = () => { setInput(''); setDecoded(null); setError(''); };

  const sampleJwt =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjk5OTk5OTk5OTl9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode and inspect JSON Web Tokens. The signature is NOT verified — this is for inspection only."
    >
      <Card style={{ marginBottom: 16 }}>
        <Label>JWT Token</Label>
        <Textarea
          value={input}
          onChange={setInput}
          placeholder="Paste your JWT token here..."
          rows={4}
        />
        <Row style={{ marginTop: 12 }}>
          <Button onClick={decode}>Decode</Button>
          <Button onClick={clear} variant="ghost">Clear</Button>
          <Button onClick={() => setInput(sampleJwt)} variant="ghost" style={{ fontSize: 12 }}>
            Load sample
          </Button>
        </Row>

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

      {decoded && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <Card>
              <Row style={{ marginBottom: 12, justifyContent: 'space-between' }}>
                <Label>Header</Label>
                <Badge color="blue">{decoded.header.alg as string}</Badge>
              </Row>
              <Textarea
                value={formatJson(decoded.header)}
                readOnly
                rows={6}
                style={{ background: '#141420' }}
              />
            </Card>
            <Card>
              <Row style={{ marginBottom: 12, justifyContent: 'space-between' }}>
                <Label>Payload</Label>
                {(() => {
                  const exp = isExpired(decoded.payload);
                  if (exp === null) return <Badge color="gray">No expiry</Badge>;
                  return exp ? <Badge color="red">✗ Expired</Badge> : <Badge color="green">✓ Valid</Badge>;
                })()}
              </Row>
              <Textarea
                value={formatJson(decoded.payload)}
                readOnly
                rows={6}
                style={{ background: '#141420' }}
              />
            </Card>
          </div>

          {decoded.payload.exp || decoded.payload.iat ? (
            <Card style={{ marginBottom: 16 }}>
              <Label>Timestamps</Label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginTop: 4 }}>
                {Boolean(decoded.payload.iat) && (
                  <div style={{ background: 'var(--muted-bg)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, fontWeight: 600 }}>Issued At (iat)</div>
                    <div style={{ fontSize: 13, color: '#e2e8f0' }}>
                      {new Date((decoded.payload.iat as number) * 1000).toLocaleString()}
                    </div>
                  </div>
                )}
                {Boolean(decoded.payload.exp) && (
                  <div style={{ background: 'var(--muted-bg)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, fontWeight: 600 }}>Expires At (exp)</div>
                    <div style={{ fontSize: 13, color: isExpired(decoded.payload) ? '#ef4444' : '#22c55e' }}>
                      {new Date((decoded.payload.exp as number) * 1000).toLocaleString()}
                    </div>
                  </div>
                )}
                {Boolean(decoded.payload.nbf) && (
                  <div style={{ background: 'var(--muted-bg)', borderRadius: 8, padding: '12px 14px' }}>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, fontWeight: 600 }}>Not Before (nbf)</div>
                    <div style={{ fontSize: 13, color: '#e2e8f0' }}>
                      {new Date((decoded.payload.nbf as number) * 1000).toLocaleString()}
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ) : null}

          <Card>
            <Label>Signature (not verified)</Label>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: 12,
                color: '#f59e0b',
                background: 'var(--muted-bg)',
                borderRadius: 8,
                padding: '12px 14px',
                wordBreak: 'break-all',
                marginTop: 4,
              }}
            >
              {decoded.signature}
            </div>
            <div
              style={{
                marginTop: 10,
                padding: '8px 12px',
                borderRadius: 6,
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.25)',
                color: '#f59e0b',
                fontSize: 12,
              }}
            >
              ⚠️ This tool only decodes the token. Signature verification requires the secret key and should be done server-side.
            </div>
          </Card>
        </>
      )}
    </ToolLayout>
  );
}
