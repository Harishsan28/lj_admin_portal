"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const mockInvoices = [
  { id: 'INV001', orderId: 'ORD001', amount: 120.5, date: '2024-07-17' },
  { id: 'INV002', orderId: 'ORD002', amount: 75.0, date: '2024-07-16' },
];

export default function InvoiceGeneration() {
  const router = useRouter();
  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    if (role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Invoice Generation</h1>
      <button style={{ marginBottom: '1.5rem', padding: '0.5rem 1rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>
        Generate New Invoice
      </button>
      <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: 4 }}>
        {mockInvoices.length === 0 ? (
          <p>No invoices found. (This is a placeholder.)</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Invoice ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {mockInvoices.map(inv => (
                <tr key={inv.id}>
                  <td style={{ padding: '0.5rem' }}>{inv.id}</td>
                  <td style={{ padding: '0.5rem' }}>{inv.orderId}</td>
                  <td style={{ padding: '0.5rem' }}>₹{inv.amount.toFixed(2)}</td>
                  <td style={{ padding: '0.5rem' }}>{inv.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 