"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Reports() {
  const router = useRouter();
  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    if (role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Reports</h1>
      <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: 4, background: '#f9f9f9' }}>
        <p>Reporting features coming soon. (This section is reserved for future expansion.)</p>
      </div>
    </div>
  );
} 