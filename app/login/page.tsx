"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import gradientBackground from '../../styles/gradientTheme';
import { API_URLS } from '../../network/apiUrls';
import { LogoLJ } from '../../components/AdminCard';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [role, setRole] = useState('admin');
  const router = useRouter();

  useEffect(() => {
    const remembered = localStorage.getItem('rememberMe');
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (remembered === 'true' && rememberedUser) {
      setUsername(rememberedUser);
      setRemember(true);
    }
    // Hide browser back button functionality
    window.history.pushState(null, '', window.location.href);
    const handlePopState = (e: PopStateEvent) => {
      window.history.pushState(null, '', window.location.href);
    };
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (remember) {
      localStorage.setItem('rememberMe', 'true');
      localStorage.setItem('rememberedUser', username);
    } else {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('rememberedUser');
    }
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      console.log("data ", data);
      if (data.success) {
        localStorage.setItem('userRole', data.user.role);
        localStorage.setItem('userAccess', data.user.access);
        if (data.user.permissions) {
          localStorage.setItem('userPermissions', JSON.stringify(data.user.permissions));
        }
        router.push('/dashboard');
      } else {
        alert('Invalid credentials');
      }
    } catch (err) {
      alert('Error connecting to backend');
      throw err;
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert('Forgot password functionality coming soon!');
  };

  return (
    <div style={{ ...gradientBackground, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{
        display: 'flex',
        background: 'rgba(255,255,255,0.95)',
        borderRadius: 18,
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.13)',
        maxWidth: 900,
        width: '100%',
        minHeight: 480,
        overflow: 'hidden',
        flexDirection: 'row',
      }}>
        {/* Left Side: Logo and Welcome Note */}
        <div style={{
          flex: 1,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2.5rem 1.5rem',
          color: '#111',
        }}>
          
          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
            <LogoLJ size={48} />
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: 1, color: '#111', textAlign: 'center' }}>Welcome Back!</h1>
          <p style={{ fontSize: 18, color: '#222', marginBottom: 0, maxWidth: 300, textAlign: 'center' }}>
            Manage your business operations efficiently and securely. Access your dashboard, users, products, and more from one place.
          </p>
        </div>
        {/* Right Side: Login Form */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 350, textAlign: 'left' }} autoComplete="on">
          <div style={{ marginBottom: 20, position: 'relative', width: '100%' }}>
            <label htmlFor="username" style={{ display: 'block', color: '#333', fontWeight: 500, marginBottom: 6 }}>Email or Username</label>
            <input
              id="username"
              type="text"
              placeholder="Enter your email or username"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0e0', borderRadius: 7, fontSize: 16, background: '#f7f7f7', color: '#333', boxSizing: 'border-box' }}
              aria-label="Email or Username"
              autoComplete="username"
            />
            <span style={{ position: 'absolute', left: 12, top: 40, color: '#bbb', pointerEvents: 'none' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </span>
          </div>
          <div style={{ marginBottom: 20, position: 'relative', width: '100%' }}>
            <label htmlFor="password" style={{ display: 'block', color: '#333', fontWeight: 500, marginBottom: 6 }}>Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '12px 12px 12px 40px', border: '1px solid #e0e0e0', borderRadius: 7, fontSize: 16, background: '#f7f7f7', color: '#333', boxSizing: 'border-box' }}
              aria-label="Password"
              autoComplete="current-password"
            />
            <span style={{ position: 'absolute', left: 12, top: 40, color: '#bbb', pointerEvents: 'none' }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20, width: '100%' }}>
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
              id="remember"
              style={{ marginRight: 8 }}
              aria-checked={remember}
            />
            <label htmlFor="remember" style={{ color: '#1976d2', fontSize: 15, marginRight: 'auto', cursor: 'pointer' }}>Remember me</label>
            <a href="#" style={{ color: '#888', fontSize: 15, textDecoration: 'none' }} onClick={handleForgotPassword}>Forgot password?</a>
          </div>
          <button type="submit" style={{ width: '100%', padding: '13px 0', background: 'linear-gradient(90deg, #1976d2 0%, #0f2027 100%)', color: '#fff', border: 'none', borderRadius: 7, fontWeight: 700, fontSize: 18, letterSpacing: 1, boxShadow: '0 2px 8px rgba(25, 118, 210, 0.15)', marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
            Sign In <span style={{ marginLeft: 8, display: 'inline-block', transform: 'translateY(1px)' }}>&rarr;</span>
          </button>
          <button
            type="button"
            onClick={() => router.push('/signup')}
            style={{ width: '100%', padding: '13px 0', background: '#fff', color: '#1976d2', border: '1px solid #1976d2', borderRadius: 7, fontWeight: 700, fontSize: 18, letterSpacing: 1, marginBottom: 10, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}
          >
            Create Account
          </button>
        </form>
        </div>
      </div>
      {/* Footer at the bottom center */}
      <div style={{
        position: 'fixed',
        left: 0,
        bottom: 0,
        width: '100vw',
        textAlign: 'center',
        fontSize: 15,
        color: '#888',
        padding: '16px 0',
        background: 'transparent',
        zIndex: 10,
      }}>
        &copy; {new Date().getFullYear()} Your Company Name
      </div>
    </div>
  );
} 