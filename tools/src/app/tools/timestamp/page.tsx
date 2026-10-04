'use client';

import { useState, useEffect } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Input, Button, Row, CopyButton } from '@/components/ui';

function pad(n: number) { return n.toString().padStart(2, '0'); }

function formatDate(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

export default function TimestampConverter() {
  const [now, setNow] = useState(Date.now());
  const [tsInput, setTsInput] = useState('');
  const [dateInput, setDateInput] = useState('');
  const [tsResult, setTsResult] = useState<{ date: Date; unix: number } | null>(null);
  const [dateResult, setDateResult] = useState<{ date: Date; unix: number } | null>(null);
  const [tsError, setTsError] = useState('');
  const [dateError, setDateError] = useState('');

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const convertTs = () => {
    setTsError('');
    const raw = tsInput.trim();
    if (!raw) return;
    const num = parseInt(raw);
    if (isNaN(num)) { setTsError('Not a valid number'); return; }
    const ms = raw.length <= 10 ? num * 1000 : num;
    const d = new Date(ms);
    if (isNaN(d.getTime())) { setTsError('Invalid timestamp'); return; }
    setTsResult({ date: d, unix: Math.floor(ms / 1000) });
  };

  const convertDate = () => {
    setDateError('');
    const raw = dateInput.trim();
    if (!raw) return;
    const d = new Date(raw);
    if (isNaN(d.getTime())) { setDateError('Invalid date format. Try: 2024-01-15 or 2024-01-15T10:30:00'); return; }
    setDateResult({ date: d, unix: Math.floor(d.getTime() / 1000) });
  };

  const useNow = () => {
    setTsInput(Math.floor(Date.now() / 1000).toString());
    setTsResult(null);
    setTsError('');
  };

  const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: 'var(--muted-bg)', borderRadius: 8, marginBottom: 8 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', width: 140, flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, fontFamily: 'monospace', fontSize: 13, color: '#e2e8f0' }}>{value}</div>
      <CopyButton text={value} />
    </div>
  );

  const nowDate = new Date(now);

  return (
    <ToolLayout
      title="Unix Timestamp Converter"
      description="Convert Unix timestamps to readable dates and vice versa. Auto-detects seconds vs milliseconds."
    >
      <Card style={{ marginBottom: 16, background: 'linear-gradient(135deg, #1a1a2e, #16213e)', border: '1px solid #2d2d5e' }}>
        <Label>Current Time</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { label: 'Unix (seconds)', value: Math.floor(now / 1000).toString() },
            { label: 'Unix (milliseconds)', value: now.toString() },
            { label: 'UTC', value: nowDate.toUTCString() },
            { label: 'ISO 8601', value: nowDate.toISOString() },
            { label: 'Local', value: formatDate(nowDate) },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4, fontWeight: 600 }}>{label}</div>
              <div style={{ fontFamily: 'monospace', fontSize: 12, color: '#a5b4fc', wordBreak: 'break-all' }}>{value}</div>
            </div>
          ))}
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <Card>
          <Label>Timestamp → Date</Label>
          <Row style={{ marginBottom: 12 }}>
            <Input
              value={tsInput}
              onChange={setTsInput}
              placeholder="1704067200 or 1704067200000"
              style={{ flex: 1 }}
            />
          </Row>
          <Row style={{ marginBottom: 12 }}>
            <Button onClick={convertTs}>Convert</Button>
            <Button onClick={useNow} variant="ghost" style={{ fontSize: 12 }}>Use Now</Button>
          </Row>
          {tsError && <div style={{ color: '#ef4444', fontSize: 12 }}>{tsError}</div>}
          {tsResult && (
            <div style={{ marginTop: 8 }}>
              <InfoRow label="Unix (seconds)" value={tsResult.unix.toString()} />
              <InfoRow label="ISO 8601" value={tsResult.date.toISOString()} />
              <InfoRow label="UTC" value={tsResult.date.toUTCString()} />
              <InfoRow label="Local" value={formatDate(tsResult.date)} />
            </div>
          )}
        </Card>

        <Card>
          <Label>Date → Timestamp</Label>
          <Row style={{ marginBottom: 12 }}>
            <Input
              value={dateInput}
              onChange={setDateInput}
              placeholder="2024-01-15 or 2024-01-15T10:30:00"
              style={{ flex: 1 }}
            />
          </Row>
          <Row style={{ marginBottom: 12 }}>
            <Button onClick={convertDate}>Convert</Button>
          </Row>
          {dateError && <div style={{ color: '#ef4444', fontSize: 12 }}>{dateError}</div>}
          {dateResult && (
            <div style={{ marginTop: 8 }}>
              <InfoRow label="Unix (seconds)" value={dateResult.unix.toString()} />
              <InfoRow label="Unix (ms)" value={dateResult.date.getTime().toString()} />
              <InfoRow label="ISO 8601" value={dateResult.date.toISOString()} />
              <InfoRow label="UTC" value={dateResult.date.toUTCString()} />
            </div>
          )}
        </Card>
      </div>
    </ToolLayout>
  );
}
