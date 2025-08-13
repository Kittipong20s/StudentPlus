// src/features/move-students/ConfirmMoveModal.jsx
import React from 'react';

export default function ConfirmMoveModal({ open, count, fromText, toText, date, onConfirm, onCancel }) {
  if (!open) return null;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)' }}>
      <div style={{ background: '#fff', maxWidth: 520, margin: '10% auto', padding: 16, borderRadius: 8 }}>
        <h3>ยืนยันการย้าย</h3>
        <p>นักเรียน {count} คน</p>
        <p>จาก: {fromText || '-'} → ไปยัง: {toText}</p>
        <p>วันที่มีผล: {date}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button onClick={onConfirm}>ยืนยัน</button>
          <button onClick={onCancel}>ยกเลิก</button>
        </div>
      </div>
    </div>
  );
}