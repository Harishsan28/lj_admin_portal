import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoLJ } from './AdminCard';

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: '🏠', permissionKey: 'dashboard' },
  { label: 'Manage Users', path: '/manage-users', icon: '👤', permissionKey: 'manageUsers' },
  { label: 'Manage Products', path: '/manage-products', icon: '📦', permissionKey: 'manageProducts' },
  { label: 'Manage Orders', path: '/manage-orders', icon: '📝', permissionKey: 'manageOrders' },
  { label: 'Payments & Transactions', path: '/payments-transactions', icon: '💳', permissionKey: 'payments' },
  { label: 'Invoice Generation', path: '/invoice-generation', icon: '🧾', permissionKey: 'invoice' },
  { label: 'Order Slip / Shipping Label Generation', path: '/order-slip-shipping-label', icon: '🚚', permissionKey: 'shipping' },
  { label: 'Reports', path: '/reports', icon: '📊', permissionKey: 'reports' },
  { label: 'Customer Details', path: '/customer-details', icon: '🧑‍💼', permissionKey: 'customerDetails' },
  { label: 'Logout', path: '/logout', icon: '🚪' },
];

function getUserRole() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userRole') || 'user';
}

function getUserAccess() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userAccess') || 'partial';
}

function getUserId() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('userId');
}

export default function AdminSidePanel() {
  const pathname = usePathname();
  const userRole = typeof window !== 'undefined' ? getUserRole() : null;
  const userAccess = typeof window !== 'undefined' ? getUserAccess() : null;
  // Only show menu items for which the user has permission (from localStorage)
  const [userPermissions, setUserPermissions] = useState<Record<string, boolean>>({});
  useEffect(() => {
    const userId = getUserId();
    if (userId) {
      fetch(`/api/users?id=${userId}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data) && data.length > 0 && data[0].permissions) {
            setUserPermissions(data[0].permissions);
          } else if (data && data.permissions) {
            setUserPermissions(data.permissions);
          }
        })
        .catch(() => {});
    }
  }, []);
  const filteredMenuItems = Object.keys(userPermissions).length === 0
    ? menuItems
    : menuItems.filter(
        item => !item.permissionKey || userPermissions[item.permissionKey] || item.path === '/logout'
      );

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
      {/* Replace text with logo */}
      <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
        <LogoLJ size={40} />
      </div>
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