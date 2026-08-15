import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

/**
 * Reusable form input with label, error message, hint, and icon support.
 */
export const Input: React.FC<InputProps> = ({
  label,
  error,
  hint,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...rest
}) => {
  const inputId = id || `input-${Math.random().toString(36).slice(2, 9)}`;

  return (
    <div className="input-group">
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
            }}
          >
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={`input ${error ? 'input-error' : ''} ${className}`}
          style={{
            paddingLeft: leftIcon ? '40px' : undefined,
            paddingRight: rightIcon ? '40px' : undefined,
          }}
          {...rest}
        />
        {rightIcon && (
          <span
            style={{
              position: 'absolute',
              right: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="input-error-msg">{error}</p>}
      {hint && !error && <p className="input-hint">{hint}</p>}
    </div>
  );
};
