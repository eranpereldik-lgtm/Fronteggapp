import React, { useEffect } from 'react';
import { AdminPortal, useAuth, useAuthActions, useLoginWithRedirect } from '@frontegg/react';
import Calculator from './components/Calculator.jsx';
import InviteForm from './components/InviteForm.jsx';

function Splash() {
  return (
    <div style={{ display:'grid', placeItems:'center', height:'100vh' }}>
      <div style={{ fontSize: 18, opacity: 0.8 }}>Loading your session…</div>
    </div>
  );
}

export default function App() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const loginWithRedirect = useLoginWithRedirect();
  const { requestAuthorize, logout } = useAuthActions();

  // Complete hosted-login redirect & clean URL
  useEffect(() => {
    if (isLoading) return;
    const params = new URLSearchParams(window.location.search);
    const hasOAuthParams =
      (params.get('code') && params.get('state')) || params.get('session_state');
    if (hasOAuthParams) {
      requestAuthorize().finally(() => {
        const url = new URL(window.location.href);
        url.search = '';
        window.history.replaceState({}, '', url.toString());
      });
    }
  }, [isLoading, requestAuthorize]);

  // One-time silent restore (if Frontegg session exists)
  useEffect(() => {
    if (isLoading) return;
    if (!isAuthenticated && !sessionStorage.getItem('fe_tried_silent')) {
      sessionStorage.setItem('fe_tried_silent', '1');
      requestAuthorize().catch(() => {}); // no active session; stay logged out
    }
  }, [isLoading, isAuthenticated, requestAuthorize]);

  if (isLoading) return <Splash />;

  if (!isAuthenticated) {
    return (
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', marginTop:'10%' }}>
        <h1>Welcome to My App</h1>
        <button onClick={() => loginWithRedirect()} style={{ padding:'10px 20px', marginTop:'20px' }}>
          Login
        </button>
      </div>
    );
  }

  // Backend base URL (from env or fallback for dev)
  const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

  return (
    <div style={{ textAlign:'center', marginTop:'24px' }}>
      <h1>Hello, {user?.name || 'User'} 👋</h1>
      <p>Email: {user?.email}</p>

      {user?.profilePictureUrl && (
        <img
          src={user.profilePictureUrl}
          alt="Profile"
          style={{ width:100, height:100, objectFit:'cover', borderRadius:'50%', marginTop:16 }}
        />
      )}

      <div style={{ marginTop:20, display:'flex', gap:12, justifyContent:'center' }}>
        <button onClick={() => AdminPortal.show()} style={{ padding:'10px 20px' }}>
          Open Admin Portal
        </button>
        <button onClick={() => logout()} style={{ padding:'10px 20px' }}>
          Logout
        </button>
      </div>

      {/* Invite mini-form (calls your Express server) */}
      <InviteForm apiBase={API_BASE} />

      {/* Your sample app feature */}
      <Calculator />
    </div>
  );
}
