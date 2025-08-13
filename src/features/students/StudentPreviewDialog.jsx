// src/features/students/StudentPreviewDialog.jsx
import React from 'react';
import CommonModal from '../../components/CommonModal';

export default function StudentPreviewDialog({ open, values, onConfirm, onCancel }) {
  if (!open) return null;
  const v = values || {};
  return (
    <CommonModal
      open={open}
      title="ยืนยันข้อมูลนักเรียน"
      onClose={onCancel}
      actions={
        <>
          <button onClick={onCancel}>ยกเลิก</button>
          <button onClick={() => onConfirm(v)}>บันทึก</button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
        <div>เลขบัตรประชาชน</div><div>{v.national_id}</div>
        <div>รหัสนักเรียน</div><div>{v.student_id}</div>
        <div>คำนำหน้า</div><div>{v.prefix}</div>
        <div>ชื่อ</div><div>{v.first_name}</div>
        <div>นามสกุล</div><div>{v.last_name}</div>
        <div>วันเกิด</div><div>{v.birth_date}</div>
        <div>ระดับการศึกษา</div><div>{v.education_stage}</div>
        <div>ระดับชั้น</div><div>{v.grade}</div>
        <div>ห้อง</div><div>{v.room}</div>
        <div>ที่อยู่</div><div style={{ whiteSpace: 'pre-wrap' }}>{v.address}</div>
        <div>เบอร์โทร</div><div>{v.phone}</div>
        <div>สถานะ</div><div>{v.status}</div>
      </div>
    </CommonModal>
  );
}