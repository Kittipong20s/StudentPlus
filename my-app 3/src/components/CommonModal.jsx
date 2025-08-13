// src/components/CommonModal.jsx
import React, { useEffect, useRef } from 'react';

function CommonModal({ open, title, children, actions, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const overlayClick = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div
      onClick={overlayClick}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,.45)',
        display: 'grid',
        placeItems: 'center',
        zIndex: 1000,
        padding: 16,
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        style={{
          background: '#fff',
          width: 'min(720px, 100%)',
          borderRadius: 12,
          boxShadow: '0 20px 60px rgba(0,0,0,.22)',
          border: '1px solid #e5e7eb',
          overflow: 'hidden',
        }}
      >
        <div style={{ padding: '14px 16px', borderBottom: '1px solid #e5e7eb' }}>
          <div id="modal-title" style={{ fontSize: 18, fontWeight: 800 }}>
            {title}
          </div>
        </div>

        <div style={{ padding: 16 }}>{children}</div>

        <div
          style={{
            display: 'flex',
            gap: 8,
            justifyContent: 'flex-end',
            padding: 12,
            borderTop: '1px solid #e5e7eb',
            background: '#fafafa',
          }}
        >
          {actions || (
            <button
              onClick={onClose}
              style={{
                padding: '8px 12px',
                borderRadius: 8,
                border: '1px solid #e5e7eb',
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              ปิด
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommonModal;