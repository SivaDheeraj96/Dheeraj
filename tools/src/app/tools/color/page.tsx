'use client';

import { useState, useCallback } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Input, Row, CopyButton } from '@/components/ui';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  const full = clean.length === 3
    ? clean.split('').map((c) => c + c).join('')
    : clean;
  if (!/^[0-9A-Fa-f]{6}$/.test(full)) return null;
  return {
    r: parseInt(full.slice(0, 2), 16),
    g: parseInt(full.slice(2, 4), 16),
    b: parseInt(full.slice(4, 6), 16),
  };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('').toUpperCase();
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  const nr = r / 255, ng = g / 255, nb = b / 255;
  const max = Math.max(nr, ng, nb), min = Math.min(nr, ng, nb);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l: Math.round(l * 100) };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === nr) h = ((ng - nb) / d + (ng < nb ? 6 : 0)) / 6;
  else if (max === ng) h = ((nb - nr) / d + 2) / 6;
  else h = ((nr - ng) / d + 4) / 6;
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  const nh = h / 360, ns = s / 100, nl = l / 100;
  if (ns === 0) {
    const v = Math.round(nl * 255);
    return { r: v, g: v, b: v };
  }
  const q = nl < 0.5 ? nl * (1 + ns) : nl + ns - nl * ns;
  const p = 2 * nl - q;
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return {
    r: Math.round(hue2rgb(p, q, nh + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, nh) * 255),
    b: Math.round(hue2rgb(p, q, nh - 1 / 3) * 255),
  };
}

function getContrastColor(r: number, g: number, b: number): string {
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

interface ColorState {
  hex: string;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
}

const PALETTE = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#f59e0b', '#22c55e', '#10b981', '#06b6d4', '#3b82f6',
  '#64748b', '#1e1e2e', '#ffffff', '#000000', '#ff6b6b',
];

export default function ColorConverter() {
  const [color, setColor] = useState<ColorState>(() => {
    const rgb = hexToRgb('#6366f1')!;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return { hex: '#6366F1', ...rgb, ...hsl };
  });

  const fromHex = useCallback((hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setColor({ hex: hex.startsWith('#') ? hex.toUpperCase() : '#' + hex.toUpperCase(), ...rgb, ...hsl });
  }, []);

  const fromRgb = useCallback((r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    setColor({ hex, r, g, b, ...hsl });
  }, []);

  const fromHsl = useCallback((h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    setColor({ hex, ...rgb, h, s, l });
  }, []);

  const contrast = getContrastColor(color.r, color.g, color.b);

  const SliderRow = ({
    label, value, max, color: trackColor, onChange,
  }: { label: string; value: number; max: number; color: string; onChange: (v: number) => void }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 12, color: 'var(--muted)', fontWeight: 600 }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: 'monospace', color: '#e2e8f0' }}>{value}</span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{ width: '100%', accentColor: trackColor, cursor: 'pointer' }}
      />
    </div>
  );

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert colors between HEX, RGB and HSL formats with a live preview."
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <div
            style={{
              height: 120,
              borderRadius: 10,
              background: color.hex,
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              color: contrast,
              fontFamily: 'monospace',
              letterSpacing: '0.1em',
            }}
          >
            {color.hex}
          </div>
          <Label>Pick Color</Label>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              type="color"
              value={color.hex.length === 7 ? color.hex : '#6366f1'}
              onChange={(e) => fromHex(e.target.value)}
              style={{
                width: 48,
                height: 42,
                borderRadius: 8,
                border: '1px solid var(--card-border)',
                cursor: 'pointer',
                background: 'none',
                padding: 2,
              }}
            />
            <Input
              value={color.hex}
              onChange={fromHex}
              placeholder="#6366F1"
            />
          </div>
          <div style={{ marginTop: 14 }}>
            <Label>Palette</Label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {PALETTE.map((c) => (
                <button
                  key={c}
                  onClick={() => fromHex(c)}
                  title={c}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: c,
                    border: color.hex.toUpperCase() === c.toUpperCase() ? '2px solid #fff' : '2px solid transparent',
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                  }}
                />
              ))}
            </div>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card>
            <Row style={{ marginBottom: 10, justifyContent: 'space-between' }}>
              <Label>HEX</Label>
              <CopyButton text={color.hex} />
            </Row>
            <div style={{ fontFamily: 'monospace', fontSize: 16, color: '#a5b4fc', background: 'var(--muted-bg)', borderRadius: 8, padding: '10px 14px' }}>
              {color.hex}
            </div>
          </Card>

          <Card>
            <Row style={{ marginBottom: 10, justifyContent: 'space-between' }}>
              <Label>RGB</Label>
              <CopyButton text={`rgb(${color.r}, ${color.g}, ${color.b})`} />
            </Row>
            <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#6ee7b7', background: 'var(--muted-bg)', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
              rgb({color.r}, {color.g}, {color.b})
            </div>
            <SliderRow label="R" value={color.r} max={255} color="#ef4444" onChange={(v) => fromRgb(v, color.g, color.b)} />
            <SliderRow label="G" value={color.g} max={255} color="#22c55e" onChange={(v) => fromRgb(color.r, v, color.b)} />
            <SliderRow label="B" value={color.b} max={255} color="#3b82f6" onChange={(v) => fromRgb(color.r, color.g, v)} />
          </Card>

          <Card>
            <Row style={{ marginBottom: 10, justifyContent: 'space-between' }}>
              <Label>HSL</Label>
              <CopyButton text={`hsl(${color.h}, ${color.s}%, ${color.l}%)`} />
            </Row>
            <div style={{ fontFamily: 'monospace', fontSize: 14, color: '#fbbf24', background: 'var(--muted-bg)', borderRadius: 8, padding: '10px 14px', marginBottom: 12 }}>
              hsl({color.h}, {color.s}%, {color.l}%)
            </div>
            <SliderRow label="H°" value={color.h} max={360} color="#8b5cf6" onChange={(v) => fromHsl(v, color.s, color.l)} />
            <SliderRow label="S%" value={color.s} max={100} color="#ec4899" onChange={(v) => fromHsl(color.h, v, color.l)} />
            <SliderRow label="L%" value={color.l} max={100} color="#f59e0b" onChange={(v) => fromHsl(color.h, color.s, v)} />
          </Card>
        </div>
      </div>

      <Card>
        <Label>CSS Snippets</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 10, marginTop: 8 }}>
          {[
            { label: 'background-color (HEX)', value: `background-color: ${color.hex};` },
            { label: 'color (RGB)', value: `color: rgb(${color.r}, ${color.g}, ${color.b});` },
            { label: 'border-color (HSL)', value: `border-color: hsl(${color.h}, ${color.s}%, ${color.l}%);` },
            { label: 'rgba (50% opacity)', value: `rgba(${color.r}, ${color.g}, ${color.b}, 0.5)` },
          ].map(({ label, value }) => (
            <div key={label} style={{ background: 'var(--muted-bg)', borderRadius: 8, padding: '10px 14px' }}>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                <code style={{ fontFamily: 'monospace', fontSize: 12, color: '#e2e8f0', wordBreak: 'break-all' }}>{value}</code>
                <CopyButton text={value} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </ToolLayout>
  );
}
