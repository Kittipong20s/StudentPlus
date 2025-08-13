// src/components/ui/Page.jsx
import React from 'react';

export default function Page({ title, actions, max = 1280, children }) {
  const maxWidth = typeof max === 'number' ? `${max}px` : max; // รับทั้งเลขและ '100%'
  return (
    <div className="page">
      <div className="page-inner" style={{ maxWidth, margin: '0 auto', width: '100%', padding: '0 16px' }}>
        {title && (
          <div className="page-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
            <h2 className="page-title" style={{ margin: 0 }}>{title}</h2>
            {actions && <div className="page-actions" style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{actions}</div>}
          </div>
        )}
        {children}
      </div>
    </div>
  );
}