'use client';

import { useEffect } from 'react';

export default function ARPage() {
  useEffect(() => {
    // Redirect to the static AR page which uses script-tag-based AR.js
    // This avoids Next.js bundler conflicts with AR.js's global dependencies
    window.location.href = '/ar.html';
  }, []);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#fff',
      fontFamily: "'Inter', sans-serif",
    }}>
      <h1 style={{ fontSize: '1.5rem', marginBottom: '1rem', letterSpacing: '0.05em' }}>
        Loading AR Experience…
      </h1>
      <div style={{
        width: 48,
        height: 48,
        border: '4px solid rgba(255,255,255,0.2)',
        borderTopColor: '#6c63ff',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
