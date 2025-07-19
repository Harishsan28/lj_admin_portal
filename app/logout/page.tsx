"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    // Simulate logout logic (e.g., clearing tokens)
    setTimeout(() => {
      router.replace('/login');
    }, 1500);
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Logging out...</h1>
      <p>You are being logged out. Redirecting to login page.</p>
    </div>
  );
} 