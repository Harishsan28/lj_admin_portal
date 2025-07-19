import React from 'react';

interface AdminCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
}

export default function AdminCard({ children, style, className, title, actions }: AdminCardProps) {
  return (
    <div
      className={className}
      style={{
        background: '#fff',
        borderRadius: 14,
        boxShadow: '0 2px 12px rgba(25, 118, 210, 0.07)',
        padding: 28,
        marginBottom: 32,
        ...style,
      }}
    >
      {(title || actions) && (
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 18 }}>
          {title && <h3 style={{ margin: 0, fontWeight: 700, fontSize: 20, color: '#1976d2', flex: 1 }}>{title}</h3>}
          {actions && <div>{actions}</div>}
        </div>
      )}
      {children}
    </div>
  );
} 