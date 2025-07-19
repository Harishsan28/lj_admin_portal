"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import gradientBackground from '../../styles/gradientTheme';

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
        toast.success("Signup successful! Please login.");
        router.push("/login");
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
      <div style={{ maxWidth: 420, width: '100%', background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(25, 118, 210, 0.08)', padding: '2.5rem 2rem' }}>
        <h2 style={{ fontWeight: 700, fontSize: 26, marginBottom: 24, color: '#1976d2' }}>Sign Up</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
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