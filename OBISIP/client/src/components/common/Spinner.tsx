import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  label?: string;
}

/**
 * Loading spinner component with optional full-screen overlay mode.
 */
export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', fullScreen, label }) => {
  const sizeClass = size === 'lg' ? 'spinner-lg' : size === 'sm' ? '' : 'spinner';

  if (fullScreen) {
    return (
      <div className="page-loader">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '3rem' }}>🍕</span>
          <div className={sizeClass || 'spinner'} role="status" aria-label="Loading" />
          {label && (
            <p style={{ color: 'var(--text-secondary)', fontSize: 'var(--text-sm)', marginTop: '0.5rem' }}>
              {label}
            </p>
          )}
        </div>
      </div>
    );
  }

  return <div className={size === 'lg' ? 'spinner spinner-lg' : 'spinner'} role="status" aria-label="Loading" />;
};
