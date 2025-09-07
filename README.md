# Eran's frontegg installed calculator app:
Quick start:
# 1. Clone/download this repo
git clone https://github.com/YOUR_USERNAME/frontegg-react-app.git
cd frontegg-react-app

# 2. Install frontend deps
npm install

# 3. Install backend deps
cd server
npm install
cd ..

# 4. Create .env
you must create server/.env with your Frontegg credentials (see below)

# 5. Start backend (in one terminal)
cd server
npm start

# 6. Start frontend (in another terminal)
cd ..
npm run dev

# 7. Open https://localhost:5173

# What did I put there?
# Client (Vite + React):
Frontegg hosted login
Shows username + profile photo
Admin portal button
E-Mail invite form (Calls in the backend)
Calculator.. So the app can do something

# Backend:
POST /api/invite → invites a user & assigns role
Uses Vendor auth (clientId + secret) to mint a JWT, then calls global Frontegg Identity API to create invites

# How do you make it work?

# Client: 
Edit src/main.jsx and edit the following:
const contextOptions = {
  baseUrl: 'https://YOUR-SUBDOMAIN.frontegg.com',
};
You can find your subdomain in the frontegg dashboard keys and domains
# Server: 
Create server/.env and add the following:

FE_VENDOR_AUTH_BASE=https://api.frontegg.com/auth/vendor
FE_API_TOKEN_CLIENT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (From your frontegg dashboard - keys and domains)
FE_API_TOKEN_SECRET=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (From your frontegg dashboard - keys and domains)
FE_IDENTITY_BASE=https://api.frontegg.com/identity
FE_TENANT_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (From your frontegg dashboard - applications - inside the application settings - the ID)
FE_TEST_ROLE_ID=xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx (From your fronegg dashboard - entitlments - roles - pick the role ID you want new users to be invited with)
PORT=3001

Thank you!








