'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Input, Row, CopyButton } from '@/components/ui';

function convert(value: string, fromBase: number) {
  if (!value.trim()) return { decimal: '', binary: '', octal: '', hex: '' };
  try {
    const decimal = parseInt(value.trim(), fromBase);
    if (isNaN(decimal)) return null;
    return {
      decimal: decimal.toString(10),
      binary: decimal.toString(2),
      octal: decimal.toString(8),
      hex: decimal.toString(16).toUpperCase(),
    };
  } catch {
    return null;
  }
}

interface Bases {
  decimal: string;
  binary: string;
  octal: string;
  hex: string;
}

export default function BaseConverter() {
  const [values, setValues] = useState<Bases>({ decimal: '', binary: '', octal: '', hex: '' });

  const handleChange = (base: keyof Bases, value: string) => {
    const baseMap: Record<keyof Bases, number> = { decimal: 10, binary: 2, octal: 8, hex: 16 };
    const result = convert(value, baseMap[base]);
    if (!result) {
      setValues((prev) => ({ ...prev, [base]: value }));
    } else {
      setValues({ ...result, [base]: value });
    }
  };

  const clear = () => setValues({ decimal: '', binary: '', octal: '', hex: '' });

  const bases: { label: string; key: keyof Bases; prefix: string; placeholder: string; maxLen?: number }[] = [
    { label: 'Decimal (Base 10)', key: 'decimal', prefix: '', placeholder: '255' },
    { label: 'Binary (Base 2)', key: 'binary', prefix: '0b', placeholder: '11111111' },
    { label: 'Octal (Base 8)', key: 'octal', prefix: '0o', placeholder: '377' },
    { label: 'Hexadecimal (Base 16)', key: 'hex', prefix: '0x', placeholder: 'FF' },
  ];

  return (
    <ToolLayout
      title="Number Base Converter"
      description="Convert numbers between Decimal, Binary, Octal and Hexadecimal. Type in any field to update all others."
    >
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <button
            onClick={clear}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: 13 }}
          >
            Clear all
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {bases.map(({ label, key, prefix, placeholder }) => (
            <div key={key}>
              <Row style={{ marginBottom: 8, justifyContent: 'space-between' }}>
                <Label>{label}</Label>
                {values[key] && <CopyButton text={`${prefix}${values[key]}`} />}
              </Row>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {prefix && (
                  <div
                    style={{
                      padding: '10px 12px',
                      background: '#141420',
                      border: '1px solid var(--card-border)',
                      borderRight: 'none',
                      borderRadius: '8px 0 0 8px',
                      fontSize: 12,
                      fontFamily: 'monospace',
                      color: '#6366f1',
                      fontWeight: 700,
                    }}
                  >
                    {prefix}
                  </div>
                )}
                <Input
                  value={values[key]}
                  onChange={(v) => handleChange(key, v.toUpperCase())}
                  placeholder={placeholder}
                  style={prefix ? { borderRadius: '0 8px 8px 0' } : {}}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Label>Quick Reference</Label>
        <div style={{ overflowX: 'auto', marginTop: 8 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, fontFamily: 'monospace' }}>
            <thead>
              <tr>
                {['Dec', 'Bin', 'Oct', 'Hex'].map((h) => (
                  <th key={h} style={{ padding: '6px 12px', textAlign: 'left', color: 'var(--muted)', fontWeight: 600, borderBottom: '1px solid var(--card-border)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((n) => (
                <tr key={n} style={{ borderBottom: '1px solid #1a1a24' }}>
                  <td style={{ padding: '5px 12px', color: '#94a3b8' }}>{n}</td>
                  <td style={{ padding: '5px 12px', color: '#a5b4fc' }}>{n.toString(2).padStart(4, '0')}</td>
                  <td style={{ padding: '5px 12px', color: '#6ee7b7' }}>{n.toString(8)}</td>
                  <td style={{ padding: '5px 12px', color: '#fbbf24' }}>{n.toString(16).toUpperCase()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </ToolLayout>
  );
}
