import React, { useState } from 'react';

export default function Calculator() {
  const [a, setA] = useState('');
  const [b, setB] = useState('');
  const [op, setOp] = useState('+');

  const parse = (v) => (v === '' ? 0 : Number(v));
  const compute = () => {
    const x = parse(a);
    const y = parse(b);
    switch (op) {
      case '+': return x + y;
      case '-': return x - y;
      case '*': return x * y;
      case '/': return y === 0 ? '∞' : x / y;
      default:  return 0;
    }
  };

  const result = compute();

  return (
    <div style={{ maxWidth: 360, margin: '24px auto', padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
      <h2 style={{ margin: 0, marginBottom: 12 }}>Calculator</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 1fr', gap: 8, alignItems: 'center' }}>
        <input
          value={a}
          onChange={(e) => setA(e.target.value)}
          placeholder="First number"
          type="number"
          style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <select value={op} onChange={(e) => setOp(e.target.value)} style={{ padding: 8, borderRadius: 8 }}>
          <option value="+">＋</option>
          <option value="-">－</option>
          <option value="*">×</option>
          <option value="/">÷</option>
        </select>
        <input
          value={b}
          onChange={(e) => setB(e.target.value)}
          placeholder="Second number"
          type="number"
          style={{ padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
        />
      </div>

      <div style={{ marginTop: 12, fontSize: 18 }}>
        <strong>Result:</strong> {String(result)}
      </div>
    </div>
  );
}
