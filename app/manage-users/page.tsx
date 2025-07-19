"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  access: string;
}

const initialUsers = [
  { id: 1, name: 'Alice Admin', email: 'alice@company.com', role: 'Admin' },
  { id: 2, name: 'Bob Manager', email: 'bob@company.com', role: 'Manager' },
  { id: 3, name: 'Carol Staff', email: 'carol@company.com', role: 'Staff' },
];

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'user', label: 'User' },
  { value: 'manager', label: 'Manager' },
  { value: 'staff', label: 'Staff' },
];
const accessOptions = [
  { value: 'full', label: 'Full Access' },
  { value: 'partial', label: 'Partial Access' },
];

export default function ManageUsers() {
  const router = useRouter();
  useEffect(() => {
    const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
    if (role !== 'admin') {
      router.replace('/dashboard');
    }
  }, [router]);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState<number | null>(null);
  const [editRole, setEditRole] = useState('');
  const [editAccess, setEditAccess] = useState('');
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ username: '', email: '', password: '', role: '', access: '' });
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      try {
        const res = await fetch('/api/users');
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      } catch {
        setUsers([]);
      }
      setLoading(false);
    }
    fetchUsers();
  }, []);

  // Placeholder actions
  const handleAdd = () => setShowAddModal(true);
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addForm.username.trim() || !addForm.email.trim() || !addForm.password.trim() || !addForm.role || !addForm.access) {
      toast.error('All fields are required.');
      return;
    }
    setAdding(true);
    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: addForm.username, email: addForm.email, password: addForm.password, role: addForm.role, access: addForm.access }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User added!');
        setUsers(users => [
          { id: data.user.id, username: addForm.username, email: addForm.email, role: addForm.role, access: addForm.access },
          ...users
        ]);
        setShowAddModal(false);
        setAddForm({ username: '', email: '', password: '', role: '', access: '' });
      } else {
        toast.error(data.message || 'Failed to add user.');
      }
    } catch {
      toast.error('Failed to add user.');
    }
    setAdding(false);
  };
  const handleEdit = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setEditId(id);
      setEditRole(user.role);
      setEditAccess(user.access);
    }
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: editRole, access: editAccess }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User updated successfully!');
        setUsers(users => users.map(u => u.id === id ? { ...u, role: editRole, access: editAccess } : u));
        setEditId(null);
      } else {
        toast.error(data.message || 'Failed to update user.');
      }
    } catch {
      toast.error('Failed to update user.');
    }
    setSaving(false);
  };

  const handleCancel = () => {
    setEditId(null);
  };
  const handleDelete = (id: number) => setUsers(users.filter(u => u.id !== id));

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #ccc',
    borderRadius: '6px',
    fontSize: '14px',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Manage Users</h1>
      <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 8px rgba(25, 118, 210, 0.08)', padding: 24, marginTop: 24, minWidth: 320 }}>
        <button onClick={handleAdd} style={{ marginBottom: 16, padding: '8px 18px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Add User</button>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', padding: '8px' }}>Name</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Email</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Role</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Access</th>
              <th style={{ textAlign: 'left', padding: '8px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>Loading users...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign: 'center', color: '#888' }}>No users found.</td></tr>
            ) : (
              users.map(user => (
                <tr key={user.id}>
                  <td style={{ padding: '8px' }}>{user.username}</td>
                  <td style={{ padding: '8px' }}>{user.email}</td>
                  {editId === user.id ? (
                    <>
                      <td style={{ padding: '8px' }}>
                        <select value={editRole} onChange={e => setEditRole(e.target.value)} style={{ padding: '4px 8px', borderRadius: 4 }}>
                          {roleOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px' }}>
                        <select value={editAccess} onChange={e => setEditAccess(e.target.value)} style={{ padding: '4px 8px', borderRadius: 4 }}>
                          {accessOptions.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px' }}>
                        <button onClick={() => handleSave(user.id)} style={{ marginRight: 8, padding: '4px 10px', background: '#43a047', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer' }} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                        <button onClick={handleCancel} style={{ padding: '4px 10px', background: '#888', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '8px' }}>{user.role}</td>
                      <td style={{ padding: '8px' }}>{user.access === 'full' ? 'Full Access' : 'Partial Access'}</td>
                      <td style={{ padding: '8px' }}>
                        <button onClick={() => handleEdit(user.id)} style={{ marginRight: 8, padding: '4px 10px', background: '#ffa726', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>Edit</button>
                        <button onClick={() => handleDelete(user.id)} style={{ padding: '4px 10px', background: '#e53935', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(25, 118, 210, 0.12)', padding: 32, minWidth: 340, maxWidth: 420 }}>
            <h3 style={{ marginTop: 0, color: '#1976d2' }}>Add User</h3>
            <form onSubmit={handleAddUser} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <input value={addForm.username} onChange={e => setAddForm(f => ({ ...f, username: e.target.value }))} placeholder="Full Name" style={inputStyle} required />
              <input value={addForm.email} onChange={e => setAddForm(f => ({ ...f, email: e.target.value }))} placeholder="Email" type="email" style={inputStyle} required />
              <input value={addForm.password} onChange={e => setAddForm(f => ({ ...f, password: e.target.value }))} placeholder="Password" type="password" style={inputStyle} required />
              <select value={addForm.role} onChange={e => setAddForm(f => ({ ...f, role: e.target.value }))} style={inputStyle} required>
                <option value="">Select role</option>
                {roles.map(r => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
              <select value={addForm.access} onChange={e => setAddForm(f => ({ ...f, access: e.target.value }))} style={inputStyle} required>
                <option value="">Select access</option>
                {accessOptions.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" disabled={adding} style={{ flex: 1, padding: '10px 0', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: adding ? 'not-allowed' : 'pointer' }}>{adding ? 'Adding...' : 'Add User'}</button>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: '10px 0', background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 