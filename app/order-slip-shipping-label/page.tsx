"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const mockLabels = [
  { id: 'LBL001', orderId: 'ORD001', type: 'Order Slip', date: '2024-07-17' },
  { id: 'LBL002', orderId: 'ORD002', type: 'Shipping Label', date: '2024-07-16' },
];

export default function OrderSlipShippingLabel() {
  const router = useRouter();
  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    if (role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Order Slip / Shipping Label Generation</h1>
      <button style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>
        Generate New Label
      </button>
      <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: 4 }}>
        {mockLabels.length === 0 ? (
          <p>No labels found. (This is a placeholder.)</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Label ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Type</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {mockLabels.map(label => (
                <tr key={label.id}>
                  <td style={{ padding: '0.5rem' }}>{label.id}</td>
                  <td style={{ padding: '0.5rem' }}>{label.orderId}</td>
                  <td style={{ padding: '0.5rem' }}>{label.type}</td>
                  <td style={{ padding: '0.5rem' }}>{label.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 