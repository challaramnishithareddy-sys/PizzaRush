import React from 'react';
import { Spinner } from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

/**
 * Reusable button with multiple variants, loading state, and icon support.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth,
  disabled,
  children,
  className = '',
  ...rest
}) => {
  const variantClass = variant === 'danger' ? 'btn-secondary' : `btn-${variant}`;
  const sizeClass = size === 'md' ? '' : `btn-${size}`;

  const style: React.CSSProperties = {};
  if (variant === 'danger') {
    style.background = 'rgba(239,68,68,0.15)';
    style.color = 'var(--color-error)';
    style.border = '1px solid rgba(239,68,68,0.3)';
  }
  if (fullWidth) style.width = '100%';

  return (
    <button
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      disabled={disabled || loading}
      style={style}
      {...rest}
    >
      {loading ? (
        <Spinner size="sm" />
      ) : (
        leftIcon
      )}
      {children && <span>{children}</span>}
      {!loading && rightIcon}
    </button>
  );
};
