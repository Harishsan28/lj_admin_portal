"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import gradientBackground from '../../styles/gradientTheme';
import { LogoLJ } from '../../components/AdminCard';

const roles = [
  { value: "admin", label: "Admin" },
  { value: "user", label: "User" },
  { value: "manager", label: "Manager" },
  { value: "staff", label: "Staff" },
];

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [access, setAccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Full Name is required.");
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required.");
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required.");
      return;
    }
    if (!role) {
      toast.error("Role is required.");
      return;
    }
    if (!access) {
      toast.error("Access is required.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, access }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Signup successful! Redirecting to dashboard...");
        router.push("/dashboard");
      } else {
        if (data.message === 'Username already exists.') {
          toast.error('Username already exists. Please choose a different name.');
        } else {
          toast.error(data.message || "Signup failed.");
        }
      }
    } catch {
      toast.error("Signup failed. Please try again.");
    }
    setLoading(false);
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
          <h1 style={{ fontSize: 32, fontWeight: 800, marginBottom: 12, letterSpacing: 1, color: '#111', textAlign: 'center' }}>Create Your Account</h1>
          <p style={{ fontSize: 18, color: '#222', marginBottom: 0, maxWidth: 300, textAlign: 'center' }}>
            Sign up to manage your business operations efficiently and securely. Access your dashboard, users, products, and more from one place.
          </p>
        </div>
        {/* Right Side: Signup Form */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2.5rem 1.5rem' }}>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 350, textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 18 }} autoComplete="on">
            <label>
              <span style={{ fontWeight: 500 }}>Full Name</span>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                style={inputStyle}
                required
                placeholder="Enter your name"
              />
            </label>
            <label>
              <span style={{ fontWeight: 500 }}>Email</span>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                required
                placeholder="Enter your email"
              />
            </label>
            <label>
              <span style={{ fontWeight: 500 }}>Password</span>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={inputStyle}
                required
                placeholder="Enter your password"
              />
            </label>
            <label>
              <span style={{ fontWeight: 500 }}>Role</span>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                style={inputStyle}
                required
              >
                <option value="">Select role</option>
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </label>
            <label>
              <span style={{ fontWeight: 500 }}>Access</span>
              <select
                value={access}
                onChange={e => setAccess(e.target.value)}
                style={inputStyle}
                required
              >
                <option value="">Select access</option>
                <option value="full">Full Access</option>
                <option value="partial">Partial Access</option>
              </select>
            </label>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(90deg, #1976d2 0%, #0f2027 100%)",
                color: "#fff",
                border: "none",
                borderRadius: 7,
                fontWeight: 700,
                fontSize: 18,
                padding: "12px 0",
                marginTop: 10,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                transition: "opacity 0.2s"
              }}
            >
              {loading ? "Signing up..." : "Sign Up"}
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

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  border: "1px solid #e0e0e0",
  borderRadius: 6,
  fontSize: 16,
  marginTop: 6,
  marginBottom: 2,
  background: "#f7f7f7",
  color: "#333",
  boxSizing: "border-box"
}; 