'use client';

import { useState } from 'react';
import ToolLayout from '@/components/ToolLayout';
import { Card, Label, Textarea, Row, CopyButton } from '@/components/ui';

function toCamelCase(str: string) {
  return str
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase())
    .replace(/^(.)/, (c) => c.toLowerCase());
}

function toPascalCase(str: string) {
  const camel = toCamelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

function toSnakeCase(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .toLowerCase()
    .replace(/^_|_$/g, '');
}

function toKebabCase(str: string) {
  return toSnakeCase(str).replace(/_/g, '-');
}

function toScreamingSnake(str: string) {
  return toSnakeCase(str).toUpperCase();
}

function toTitleCase(str: string) {
  return str.replace(/\b\w/g, (c) => c.toUpperCase());
}

function toDotCase(str: string) {
  return toSnakeCase(str).replace(/_/g, '.');
}

function toPathCase(str: string) {
  return toSnakeCase(str).replace(/_/g, '/');
}

export default function CaseConverter() {
  const [input, setInput] = useState('');

  const cases: { label: string; key: string; transform: (s: string) => string; example: string }[] = [
    { label: 'camelCase', key: 'camel', transform: toCamelCase, example: 'helloWorldExample' },
    { label: 'PascalCase', key: 'pascal', transform: toPascalCase, example: 'HelloWorldExample' },
    { label: 'snake_case', key: 'snake', transform: toSnakeCase, example: 'hello_world_example' },
    { label: 'kebab-case', key: 'kebab', transform: toKebabCase, example: 'hello-world-example' },
    { label: 'SCREAMING_SNAKE_CASE', key: 'screaming', transform: toScreamingSnake, example: 'HELLO_WORLD_EXAMPLE' },
    { label: 'Title Case', key: 'title', transform: toTitleCase, example: 'Hello World Example' },
    { label: 'UPPERCASE', key: 'upper', transform: (s) => s.toUpperCase(), example: 'HELLO WORLD EXAMPLE' },
    { label: 'lowercase', key: 'lower', transform: (s) => s.toLowerCase(), example: 'hello world example' },
    { label: 'dot.case', key: 'dot', transform: toDotCase, example: 'hello.world.example' },
    { label: 'path/case', key: 'path', transform: toPathCase, example: 'hello/world/example' },
  ];

  return (
    <ToolLayout
      title="Case Converter"
      description="Convert text between camelCase, snake_case, kebab-case, PascalCase and more."
    >
      <Card style={{ marginBottom: 16 }}>
        <Label>Input Text</Label>
        <Textarea
          value={input}
          onChange={setInput}
          placeholder="Type or paste text here... (e.g. hello world or helloWorld or hello-world)"
          rows={4}
          fontMono={false}
        />
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12 }}>
        {cases.map(({ label, key, transform, example }) => {
          const result = input ? transform(input) : '';
          return (
            <Card key={key}>
              <Row style={{ marginBottom: 8, justifyContent: 'space-between' }}>
                <Label>{label}</Label>
                {result && <CopyButton text={result} />}
              </Row>
              <div
                style={{
                  fontFamily: 'ui-monospace, SFMono-Regular, monospace',
                  fontSize: 13,
                  color: result ? '#e2e8f0' : '#3d3d5c',
                  background: 'var(--muted-bg)',
                  borderRadius: 7,
                  padding: '9px 12px',
                  minHeight: 38,
                  wordBreak: 'break-all',
                }}
              >
                {result || <span style={{ color: '#3d3d5c', fontSize: 12 }}>e.g. {example}</span>}
              </div>
            </Card>
          );
        })}
      </div>
    </ToolLayout>
  );
}
