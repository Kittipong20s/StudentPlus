// src/components/ui/Card.jsx
import React from 'react';

export default function Card({ children, style }) {
  return (
    <div
      className="card"
      style={{
        width: '100%',                 // <<< สำคัญ
        background: '#fff',
        border: '1px solid #eef0f3',
        borderRadius: 16,
        padding: 16,
        boxShadow: '0 10px 30px rgba(21, 24, 57, .06)',
        ...style,
      }}
    >
      {children}
    </div>
  );
}