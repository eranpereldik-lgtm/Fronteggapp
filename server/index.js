// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const {
  FE_VENDOR_AUTH_BASE,
  FE_API_TOKEN_CLIENT_ID,
  FE_API_TOKEN_SECRET,
  FE_TENANT_ID,
  FE_TEST_ROLE_ID,
  FE_IDENTITY_BASE,
  PORT = 3001,
} = process.env;

const app = express();
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());


async function getBearer() {
  const res = await fetch(`${FE_VENDOR_AUTH_BASE}/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      clientId: FE_API_TOKEN_CLIENT_ID,
      secret: FE_API_TOKEN_SECRET,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Vendor auth failed (${res.status}): ${text}`);
  }
  const json = await res.json();
  // Most responses return { "token": "..." }
  return json.token || json.accessToken || json?.data?.token;
}

// healthcheck
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, now: new Date().toISOString() });
});

// Invite endpoint
app.post('/api/invite', async (req, res) => {
  try {
    const { email, name } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email required' });

    const bearer = await getBearer();

    const payload = {
      users: [
        {
          email,
          name,
          provider: 'local',
          roleIds: [FE_TEST_ROLE_ID],
          // skipInviteEmail: false, // default is email sent
          // expirationInSeconds: 7*24*3600, // optional guest expiry
        },
      ],
    };

    // Use your ENVIRONMENT host for identity (not the global api host)
    const inviteRes = await fetch(
      `${FE_IDENTITY_BASE}/resources/users/bulk/v1/invite`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${bearer}`,
          'Content-Type': 'application/json',
          'frontegg-tenant-id': FE_TENANT_ID,
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await inviteRes.text();
    if (!inviteRes.ok) {
      return res.status(inviteRes.status).send(text || 'Invite failed');
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error('Invite error:', e);
    return res.status(500).json({ error: e.message });
  }
});

app.listen(PORT, () => {
  console.log(`Invite API listening on http://localhost:${PORT}`);
});
