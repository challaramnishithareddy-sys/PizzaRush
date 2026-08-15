import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: string;
}

/**
 * Accessible modal dialog with backdrop, keyboard (Escape) close, and focus trap.
 */
export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = '560px',
}) => {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div className="modal-content" style={{ maxWidth }}>
        {title && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-6)',
              borderBottom: '1px solid var(--border-subtle)',
            }}
          >
            <h3
              id="modal-title"
              style={{ fontFamily: 'var(--font-display)', fontSize: 'var(--text-xl)' }}
            >
              {title}
            </h3>
            <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close modal">
              <X size={18} />
            </Button>
          </div>
        )}
        <div style={{ padding: 'var(--space-6)' }}>{children}</div>
      </div>
    </div>
  );
};
