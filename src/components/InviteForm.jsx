import React, { useState } from 'react';

export default function InviteForm({ apiBase }) {
  const [email, setEmail] = useState('');
  const [name, setName]   = useState('');
  const [status, setStatus] = useState('');

  const invite = async () => {
    if (!email) return setStatus('Enter an email address');
    setStatus('Inviting…');
    try {
      const r = await fetch(`${apiBase}/api/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      if (!r.ok) {
        const txt = await r.text();
        setStatus(`Failed: ${txt || r.status}`);
        return;
      }
      setStatus('Invite sent ✅');
      setEmail('');
      setName('');
    } catch (e) {
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <div style={{ maxWidth: 520, margin: '24px auto', padding: 16, border: '1px solid #eee', borderRadius: 12 }}>
      <h3 style={{ marginTop: 0 }}>Invite a user (Test role)</h3>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <input
          type="email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          placeholder="new.user@example.com"
          style={{ flex: 1, minWidth: 220, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <input
          type="text"
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Optional name"
          style={{ flex: 1, minWidth: 180, padding: 8, borderRadius: 8, border: '1px solid #ccc' }}
        />
        <button onClick={invite} style={{ padding: '8px 16px' }}>Invite</button>
      </div>
      <div style={{ marginTop: 8, fontSize: 14, opacity: 0.85 }}>{status}</div>
    </div>
  );
}
