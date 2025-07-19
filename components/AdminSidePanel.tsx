import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '🏠', roles: ['admin', 'user', 'manager', 'staff'] },
  { label: 'Manage Users', path: '/manage-users', icon: '👤', roles: ['admin'] },
  { label: 'Manage Products', path: '/manage-products', icon: '📦', roles: ['admin'] },
  { label: 'Manage Orders', path: '/manage-orders', icon: '📝', roles: ['admin'] },
  { label: 'Payments & Transactions', path: '/payments-transactions', icon: '💳', roles: ['admin'] },
  { label: 'Invoice Generation', path: '/invoice-generation', icon: '🧾', roles: ['admin'] },
  { label: 'Order Slip / Shipping Label Generation', path: '/order-slip-shipping-label', icon: '🚚', roles: ['admin'] },
  { label: 'Reports', path: '/reports', icon: '📊', roles: ['admin'] },
  { label: 'Customer Details', path: '/customer-details', icon: '🧑‍💼', roles: ['admin'] },
  { label: 'Logout', path: '/logout', icon: '🚪', roles: ['admin', 'user', 'manager', 'staff'] },
];

function getUserRole() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userRole') || 'user';
}

function getUserAccess() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userAccess') || 'partial';
}

export default function AdminSidePanel() {
  const pathname = usePathname();
  const userRole = typeof window !== 'undefined' ? getUserRole() : null;
  const userAccess = typeof window !== 'undefined' ? getUserAccess() : null;

  // Show all menus if full access, else only Dashboard and Logout
  const filteredMenuItems = userAccess === 'full'
    ? menuItems
    : menuItems.filter(item => ['Dashboard', 'Logout'].includes(item.label));

  const [isClient, setIsClient] = useState(false);
  useEffect(() => { setIsClient(true); }, []);

  return (
    <aside style={{
      width: 240,
      background: '#1a2236',
      height: '100vh',
      overflowY: 'auto', // Make sidebar scrollable
      padding: '2rem 1rem',
      boxSizing: 'border-box',
      position: 'fixed',
      left: 0,
      top: 0,
      color: '#fff',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000
    }}>
      <h2 style={{ marginBottom: '2rem', fontWeight: 800, fontSize: 24, letterSpacing: 1, color: '#fff' }}>Admin Panel</h2>
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {filteredMenuItems
            .map(item => {
              const isActive = pathname === item.path;
              return (
                <li key={item.path} style={{ marginBottom: '1.2rem' }}>
                  <Link
                    href={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      textDecoration: 'none',
                      color: isActive ? '#1976d2' : '#fff',
                      background: isActive ? 'rgba(25, 118, 210, 0.12)' : 'transparent',
                      fontWeight: isActive ? 700 : 500,
                      borderRadius: 8,
                      padding: '0.7rem 1rem',
                      transition: 'background 0.2s, color 0.2s',
                      gap: 14,
                      boxShadow: isActive ? '0 2px 8px rgba(25, 118, 210, 0.08)' : undefined
                    }}
                  >
                    <span style={{ fontSize: 20 }}>{isClient ? item.icon : ''}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
        </ul>
      </nav>
      <div style={{ fontSize: 13, color: '#aaa', marginTop: 'auto', textAlign: 'center' }}>
        &copy; {new Date().getFullYear()} Admin Portal
      </div>
    </aside>
  );
} 