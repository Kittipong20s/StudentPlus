// src/components/Pagination.jsx
import React from 'react';

export default function Pagination({ page, pageSize, total, onChange }) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const set = (p) => onChange && onChange(Math.min(Math.max(1, p), pages));

  if (pages <= 1) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <button onClick={() => set(1)} disabled={page <= 1}>{'<<'}</button>
      <button onClick={() => set(page - 1)} disabled={page <= 1}>{'<'}</button>
      <span>หน้า {page} / {pages}</span>
      <button onClick={() => set(page + 1)} disabled={page >= pages}>{'>'}</button>
      <button onClick={() => set(pages)} disabled={page >= pages}>{'>>'}</button>
    </div>
  );
}