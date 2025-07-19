"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const mockOrders = [
  { id: 'ORD001', customer: 'John Doe', status: 'Pending' },
  { id: 'ORD002', customer: 'Jane Smith', status: 'Shipped' },
];

export default function ManageOrders() {
  const router = useRouter();
  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    if (role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Orders</h1>
      <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: 4 }}>
        {mockOrders.length === 0 ? (
          <p>No orders found. (This is a placeholder.)</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
                <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockOrders.map(order => (
                <tr key={order.id}>
                  <td style={{ padding: '0.5rem' }}>{order.id}</td>
                  <td style={{ padding: '0.5rem' }}>{order.customer}</td>
                  <td style={{ padding: '0.5rem' }}>{order.status}</td>
                  <td style={{ padding: '0.5rem' }}>
                    <button style={{ padding: '0.25rem 0.75rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: 4 }}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
} 