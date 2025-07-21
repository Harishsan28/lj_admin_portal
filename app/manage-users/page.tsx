"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  access: string;
  permissions?: Record<string, boolean>;
}

const initialUsers = [
  { id: 1, username: 'alice', email: 'alice@company.com', role: 'Admin', access: 'full' },
  { id: 2, username: 'bob', email: 'bob@company.com', role: 'Manager', access: 'full' },
  { id: 3, username: 'carol', email: 'carol@company.com', role: 'Staff', access: 'full' },
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

const adminPanelScreens = [
  { key: 'dashboard', label: 'Dashboard' },
  { key: 'manageUsers', label: 'Manage Users' },
  { key: 'manageProducts', label: 'Manage Products' },
  { key: 'manageOrders', label: 'Manage Orders' },
  { key: 'payments', label: 'Payments & Transactions' },
  { key: 'invoice', label: 'Invoice Generation' },
  { key: 'shipping', label: 'Order Slip / Shipping Label' },
  { key: 'reports', label: 'Reports' },
  { key: 'customerDetails', label: 'Customer Details' },
];
const subActions = {
  manageUsers: [
    { key: 'addUser', label: 'Add User' },
    { key: 'editUser', label: 'Edit User' },
    { key: 'deleteUser', label: 'Delete User' },
  ],
  manageProducts: [
    { key: 'addProduct', label: 'Add Product' },
    { key: 'editProduct', label: 'Edit Product' },
    { key: 'deleteProduct', label: 'Delete Product' },
  ],
};

function isSubActionKey(key: string): key is keyof typeof subActions {
  return key === 'manageUsers' || key === 'manageProducts';
}

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
  const [editPermissions, setEditPermissions] = useState<Record<string, boolean>>({});
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settingsUser, setSettingsUser] = useState<User | null>(null);
  const [settingsPermissions, setSettingsPermissions] = useState<Record<string, boolean>>({});

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
      setEditPermissions(user.permissions || {});
    }
  };

  const handleSave = async (id: number) => {
    setSaving(true);
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, role: editRole, access: editAccess, permissions: editPermissions }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User updated successfully!');
        setUsers(users => users.map(u => u.id === id ? { ...u, role: editRole, access: editAccess, permissions: editPermissions } : u));
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
    boxSizing: 'border-box' as const,
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
                          {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px' }}>
                        <select value={editAccess} onChange={e => setEditAccess(e.target.value)} style={{ padding: '4px 8px', borderRadius: 4 }}>
                          {accessOptions.map(a => <option key={a.value} value={a.value}>{a.label}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '8px', minWidth: 180 }}>
                        {/* Permissions toggles */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label>
                            <input
                              type="checkbox"
                              checked={!!editPermissions.canEdit}
                              onChange={e => setEditPermissions(p => ({ ...p, canEdit: e.target.checked }))}
                            /> Can Edit
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={!!editPermissions.canDelete}
                              onChange={e => setEditPermissions(p => ({ ...p, canDelete: e.target.checked }))}
                            /> Can Delete
                          </label>
                          <label>
                            <input
                              type="checkbox"
                              checked={!!editPermissions.canViewReports}
                              onChange={e => setEditPermissions(p => ({ ...p, canViewReports: e.target.checked }))}
                            /> Can View Reports
                          </label>
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <button onClick={() => handleSave(user.id)} style={{ marginRight: 8, padding: '4px 10px', background: '#43a047', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: saving ? 'not-allowed' : 'pointer' }} disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                          <button onClick={handleCancel} style={{ padding: '4px 10px', background: '#888', color: '#fff', border: 'none', borderRadius: 4, fontSize: 14, cursor: 'pointer' }}>Cancel</button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ padding: '8px' }}>{user.role}</td>
                      <td style={{ padding: '8px' }}>{user.access === 'full' ? 'Full Access' : 'Partial Access'}</td>
                      <td style={{ padding: '8px', minWidth: 120 }}>
                        <button
                          onClick={() => handleEdit(user.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                          title="Edit"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ffa726" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>
                        </button>
                          <button
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                            title="Settings"
                            onClick={() => {
                              setSettingsUser(user);
                              if (user.permissions && Object.keys(user.permissions).length > 0) {
                                setSettingsPermissions(user.permissions);
                              } else {
                                const allPerms: Record<string, boolean> = {};
                                adminPanelScreens.forEach(screen => { allPerms[screen.key] = true; });
                                setSettingsPermissions(allPerms);
                              }
                              setShowSettingsModal(true);
                            }}
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1976d2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 8a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09c0 .66.38 1.26 1 1.51a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82c.13.53.13 1.09 0 1.62z"/></svg>
                          </button>
                      
                        <button
                          onClick={() => handleDelete(user.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}
                          title="Delete"
                        >
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M6 7V15C6 15.55 6.45 16 7 16H13C13.55 16 14 15.55 14 15V7M9 10V13M11 10V13M4 7H16M8 4H12C12.55 4 13 4.45 13 5V6H7V5C7 4.45 7.45 4 8 4Z" stroke="#e53935" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
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
      {showSettingsModal && settingsUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 3000, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', backdropFilter: 'blur(6px)', background: 'rgba(0,0,0,0.18)', zIndex: 1 }} />
          <div className="settings-modal-slidein" style={{ position: 'relative', zIndex: 2, background: '#fff', borderRadius: 12, boxShadow: '0 2px 16px rgba(25, 118, 210, 0.12)', padding: 32, minWidth: 340, maxWidth: 420, height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflowY: 'auto', transform: showSettingsModal ? 'translateX(0)' : 'translateX(100%)', transition: 'transform 0.4s cubic-bezier(0.4,0,0.2,1)' }}>
            <h3 style={{ marginTop: 50, paddingTop: 16, color: '#1976d2', textAlign: 'center', fontSize: 26, fontWeight: 800, letterSpacing: 1 }}>Panel Access for {settingsUser.username}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
              {adminPanelScreens.map(screen => (
                <div key={screen.key} style={{ marginBottom: 8 }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={!!settingsPermissions[screen.key]}
                      onChange={e => setSettingsPermissions(p => ({ ...p, [screen.key]: e.target.checked }))}
                    />
                    {screen.label}
                  </label>
                  {/* Sub-action toggles for Manage Users and Manage Products */}
                  {isSubActionKey(screen.key) && (
                    <div style={{ marginLeft: 24, display: 'flex', flexDirection: 'column', gap: 4 }}>
                      {(subActions[screen.key] as { key: string; label: string }[]).map((sub: any) => (
                        <label key={sub.key} style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 400 }}>
                          <input
                            type="checkbox"
                            checked={!!settingsPermissions[sub.key]}
                            onChange={e => setSettingsPermissions(p => ({ ...p, [sub.key]: e.target.checked }))}
                            disabled={!settingsPermissions[screen.key]}
                          />
                          {sub.label}
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button
                onClick={async () => {
                  // Save permissions to backend
                  await fetch('/api/users', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      id: settingsUser.id,
                      role: settingsUser.role,
                      access: settingsUser.access,
                      permissions: settingsPermissions // <--- This is the updated permissions object
                    }),
                  });
                  setShowSettingsModal(false);
                  // Optionally update local state
                  setUsers(users => users.map(u => u.id === settingsUser.id ? { ...u, permissions: settingsPermissions } : u));
                  toast.success('Permissions updated successfully!');
                }}
                style={{ padding: '8px 18px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
              >
                Save
              </button>
              <button
                onClick={() => setShowSettingsModal(false)}
                style={{ padding: '8px 18px', background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 15, cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 