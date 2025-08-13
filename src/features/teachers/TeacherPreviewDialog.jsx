// src/features/teachers/TeacherPreviewDialog.jsx
import React from 'react';
import CommonModal from '../../components/CommonModal';

export default function TeacherPreviewDialog({ open, values, onConfirm, onCancel }) {
  if (!open) return null;
  const v = values || {};
  return (
    <CommonModal
      open={open}
      title="ยืนยันข้อมูลคุณครู"
      onClose={onCancel}
      actions={
        <>
          <button onClick={onCancel}>ยกเลิก</button>
          <button onClick={() => onConfirm(v)}>บันทึก</button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
        <div>รหัสประจำตัวคุณครู</div><div>{v.teacher_code}</div>
        <div>คำนำหน้า</div><div>{v.prefix}</div>
        <div>ชื่อ</div><div>{v.first_name}</div>
        <div>นามสกุล</div><div>{v.last_name}</div>
        <div>เบอร์โทร</div><div>{v.phone}</div>
        <div>อีเมล</div><div>{v.email}</div>
        <div>ตำแหน่ง</div><div>{v.position}</div>
      </div>
    </CommonModal>
  );
}