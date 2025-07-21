import React from 'react';

interface AdminCardProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  title?: string;
  actions?: React.ReactNode;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function AdminCard({ children, style, className, title, actions, onMouseEnter, onMouseLeave, onClick }: AdminCardProps) {
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
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

// Reusable LJ Logo component
export function LogoLJ({ size = 32 }: { size?: number }) {
  const circleSize = size * 1.7;
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: circleSize,
        height: circleSize,
        borderRadius: '50%',
        background: 'linear-gradient(120deg, #1976d2 0%, #56ccf2 100%)',
        boxShadow: '0 2px 12px rgba(25, 118, 210, 0.13)',
        userSelect: 'none',
      }}
    >
      <span
        style={{
          color: '#fff',
          fontFamily:
            `'Montserrat', 'Great Vibes', 'Satisfy', 'Parisienne', 'Dancing Script', 'cursive', 'Pacifico', 'Lobster', 'Comic Sans MS', sans-serif`,
          fontSize: size,
          fontWeight: 900,
          letterSpacing: 2,
          textAlign: 'center',
          lineHeight: 1,
          textShadow: '0 2px 8px #1976d2, 0 1px 2px #fff',
        }}
      >
        LJ
      </span>
    </span>
  );
} 