"use client";

import React, { useState, useEffect } from "react";
import AdminCard from '../../components/AdminCard';
import toast from 'react-hot-toast';

export default function CustomerDetails() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [selected, setSelected] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', address: '', phone: '', email: '' });
  const [creating, setCreating] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const [orderForm, setOrderForm] = useState({ orderId: '', date: '', amount: '', status: 'Pending' });
  const [addingOrder, setAddingOrder] = useState(false);

  const filteredCustomers = customers.filter(cust =>
    cust.name.toLowerCase().includes(search.toLowerCase()) ||
    cust.email.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const paginatedCustomers = filteredCustomers.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      try {
        const res = await fetch('/api/customers');
        const data = await res.json();
        setCustomers(Array.isArray(data) ? data : []);
      } catch {
        setCustomers([]);
      }
      setLoading(false);
    }
    fetchCustomers();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.address || !form.phone || !form.email) {
      toast.error('All fields are required.');
      return;
    }
    setCreating(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Customer created!');
        setCustomers(custs => [data.customer, ...custs]);
        setForm({ name: '', address: '', phone: '', email: '' });
      } else {
        toast.error(data.message || 'Failed to create customer.');
      }
    } catch {
      toast.error('Failed to create customer.');
    }
    setCreating(false);
  }

  async function handleAddOrder(e: React.FormEvent) {
    e.preventDefault();
    if (!orderForm.orderId || !orderForm.date || !orderForm.amount || !orderForm.status) {
      toast.error('All order fields are required.');
      return;
    }
    setAddingOrder(true);
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: selected.id, order: { ...orderForm, amount: parseFloat(orderForm.amount) } }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Order added!');
        setSelected((cust: any) => ({ ...cust, orders: [data.order, ...cust.orders] }));
        setOrderForm({ orderId: '', date: '', amount: '', status: 'Pending' });
      } else {
        toast.error(data.message || 'Failed to add order.');
      }
    } catch {
      toast.error('Failed to add order.');
    }
    setAddingOrder(false);
  }

  return (
    <div style={{ padding: '2rem' }}>
      <AdminCard title="Customer Details">
        <form onSubmit={handleCreate} style={{ display: 'flex', gap: 12, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
          <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Name" style={inputStyle} required />
          <input value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} placeholder="Address" style={inputStyle} required />
          <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="Phone" style={inputStyle} required />
          <input value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" style={inputStyle} required />
          <button type="submit" disabled={creating} style={{ padding: '8px 18px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: creating ? 'not-allowed' : 'pointer' }}>{creating ? 'Adding...' : 'Add Customer'}</button>
        </form>
        <div style={{ marginBottom: 14 }}>
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search by name or email..." style={{ ...inputStyle, maxWidth: 260 }} />
        </div>
        {loading ? (
          <p>Loading customers...</p>
        ) : filteredCustomers.length === 0 ? (
          <p>No customers found.</p>
        ) : (
          <>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Name</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Email</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Phone</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map(cust => (
                  <tr key={cust.id}>
                    <td style={{ padding: '0.5rem' }}>{cust.name}</td>
                    <td style={{ padding: '0.5rem' }}>{cust.email}</td>
                    <td style={{ padding: '0.5rem' }}>{cust.phone}</td>
                    <td style={{ padding: '0.5rem' }}>
                      <button
                        style={{ padding: '4px 12px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 5, fontWeight: 600, cursor: 'pointer' }}
                        onClick={() => setSelected(cust)}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 18 }}>
              <button onClick={() => setPage(page - 1)} disabled={page === 1} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #e0e0e0', background: page === 1 ? '#f4f4f4' : '#fff', color: '#1976d2', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>Prev</button>
              <span style={{ fontSize: 15 }}>Page {page} of {totalPages}</span>
              <button onClick={() => setPage(page + 1)} disabled={page === totalPages} style={{ padding: '6px 16px', borderRadius: 6, border: '1px solid #e0e0e0', background: page === totalPages ? '#f4f4f4' : '#fff', color: '#1976d2', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>Next</button>
            </div>
          </>
        )}
      </AdminCard>
      {selected && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000
        }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(25, 118, 210, 0.12)', padding: 32, minWidth: 340, maxWidth: 420 }}>
            <h3 style={{ marginTop: 0, color: '#1976d2' }}>{selected.name}</h3>
            <div style={{ marginBottom: 10 }}><strong>Address:</strong> {selected.address}</div>
            <div style={{ marginBottom: 10 }}><strong>Phone:</strong> {selected.phone}</div>
            <div style={{ marginBottom: 10 }}><strong>Email:</strong> {selected.email}</div>
            <div style={{ marginBottom: 10 }}><strong>Orders:</strong></div>
            <form onSubmit={handleAddOrder} style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <input value={orderForm.orderId} onChange={e => setOrderForm(f => ({ ...f, orderId: e.target.value }))} placeholder="Order ID" style={inputStyle} required />
              <input value={orderForm.date} onChange={e => setOrderForm(f => ({ ...f, date: e.target.value }))} type="date" style={inputStyle} required />
              <input value={orderForm.amount} onChange={e => setOrderForm(f => ({ ...f, amount: e.target.value }))} placeholder="Amount" type="number" min="0" style={inputStyle} required />
              <select value={orderForm.status} onChange={e => setOrderForm(f => ({ ...f, status: e.target.value }))} style={inputStyle} required>
                <option value="Pending">Pending</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
              <button type="submit" disabled={addingOrder} style={{ padding: '6px 14px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 5, fontWeight: 600, cursor: addingOrder ? 'not-allowed' : 'pointer' }}>{addingOrder ? 'Adding...' : 'Add Order'}</button>
            </form>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 16 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Order ID</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Date</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Amount (₹)</th>
                  <th style={{ textAlign: 'left', padding: '0.5rem' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {selected.orders.map((order: any) => (
                  <tr key={order.id}>
                    <td style={{ padding: '0.5rem' }}>{order.orderId}</td>
                    <td style={{ padding: '0.5rem' }}>{new Date(order.date).toLocaleDateString()}</td>
                    <td style={{ padding: '0.5rem' }}>₹{order.amount.toLocaleString()}</td>
                    <td style={{ padding: '0.5rem' }}>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              style={{ padding: '8px 18px', background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 }}
              onClick={() => setSelected(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "8px 10px",
  border: "1px solid #e0e0e0",
  borderRadius: 6,
  fontSize: 15,
  marginBottom: 2,
  background: "#f7f7f7",
  color: "#333",
  boxSizing: "border-box"
}; 