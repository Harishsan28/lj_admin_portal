"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const mockTransactions = [
  { id: 'TXN001', orderId: 'ORD001', amount: 120.5, status: 'Completed' },
  { id: 'TXN002', orderId: 'ORD002', amount: 75.0, status: 'Pending' },
];

export default function PaymentsTransactions() {
  const router = useRouter();
  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    if (role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Payments & Transactions</h1>
      <div style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f9f9f9', borderRadius: 4 }}>
        <strong>Summary:</strong> <br />
        Total Transactions: {mockTransactions.length} <br />
        Total Amount: ₹{mockTransactions.reduce((sum, t) => sum + t.amount, 0).toFixed(2)}
      </div>
      <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: 4 }}>
        {mockTransactions.length === 0 ? (
          <p>No transactions found. (This is a placeholder.)</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Transaction ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Amount</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {mockTransactions.map(txn => (
                <tr key={txn.id}>
                  <td style={{ padding: '0.5rem' }}>{txn.id}</td>
                  <td style={{ padding: '0.5rem' }}>{txn.orderId}</td>
                  <td style={{ padding: '0.5rem' }}>₹{txn.amount.toFixed(2)}</td>
                  <td style={{ padding: '0.5rem' }}>{txn.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 