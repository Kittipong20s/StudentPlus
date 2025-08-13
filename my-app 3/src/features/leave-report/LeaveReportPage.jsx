// src/features/leave-report/LeaveReportPage.jsx
import React from 'react';

export default function LeaveReportPage() {
  return (
    <div className="card">
      <h2 className="page-title">รายงานการลา</h2>

      <p style={{ color: 'var(--muted)' }}>
        หน้านี้ยังอยู่ระหว่างการพัฒนา (Placeholder)
      </p>

      <div className="actions" style={{ marginTop: 12 }}>
        <button className="btn">ตัวอย่างปุ่ม</button>
        <button className="btn secondary">ตัวอย่างปุ่ม (รอง)</button>
      </div>
    </div>
  );
}