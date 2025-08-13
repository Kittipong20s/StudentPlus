// src/components/ToastHost.jsx
import React, { useEffect, useState } from 'react';
import { subscribeToast, unsubscribeToast } from '../hooks/useToast';

export default function ToastHost() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const cb = (toast) => {
      setItems((prev) => [...prev, toast]);
      setTimeout(() => {
        setItems((prev) => prev.filter((t) => t.id !== toast.id));
      }, toast.duration || 2500);
    };
    subscribeToast(cb);
    return () => unsubscribeToast(cb);
  }, []);

  return (
    <div style={{
      position: 'fixed', right: 16, bottom: 16, display: 'grid', gap: 8, zIndex: 60,
    }}>
      {items.map((t) => (
        <div key={t.id} style={{
          background: t.variant === 'error' ? '#fee2e2' : '#ecfeff',
          border: '1px solid #e5e7eb', borderLeft: `6px solid ${t.variant === 'error' ? '#ef4444' : '#06b6d4'}`,
          padding: '10px 12px', borderRadius: 10, minWidth: 260,
          boxShadow: '0 8px 20px rgba(0,0,0,.08)'
        }}>
          {t.title && <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.title}</div>}
          <div>{t.message}</div>
        </div>
      ))}
    </div>
  );
}