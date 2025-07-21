"use client";
import React from 'react';
import AdminSidePanel from './AdminSidePanel';
import { usePathname } from 'next/navigation';
import gradientBackground from '../styles/gradientTheme';
import { LogoLJ } from './AdminCard';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidePanel = pathname === '/login' || pathname === '/signup';
  return (
    <div style={{ minHeight: '100vh', background: '#f4f6fa', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      {!hideSidePanel && (
        <header style={{
          height: 64,
          background: '#fff',
          borderBottom: '1px solid #e0e0e0',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: hideSidePanel ? 24 : 264,
          paddingRight: 32,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 900,
          boxShadow: '0 2px 8px rgba(25, 118, 210, 0.04)'
        }}>
          {/* Replace text with logo */}
          <span style={{ fontWeight: 700, fontSize: 18, color: '#1976d2', letterSpacing: 1 }}><LogoLJ size={32} /></span>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 18 }}>
            {/* Placeholder for user info, notifications, etc. */}
            <span style={{ color: '#888', fontSize: 15 }}>Welcome, Admin</span>
            <span style={{ fontSize: 22, color: '#1976d2' }}>👤</span>
          </div>
        </header>
      )}
      <div style={{ display: 'flex', flex: 1, marginTop: hideSidePanel ? 0 : 64 }}>
        {!hideSidePanel && <AdminSidePanel />}
        <main style={{
          marginLeft: hideSidePanel ? 0 : 240,
          width: '100%',
          minHeight: 'calc(100vh - 64px)',
          padding: hideSidePanel ? 0 : '2.5rem 2.5rem 2.5rem 2.5rem',
          background: '#f4f6fa',
          boxSizing: 'border-box',
          transition: 'margin-left 0.2s',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
        }}>{children}</main>
      </div>
    </div>
  );
} 