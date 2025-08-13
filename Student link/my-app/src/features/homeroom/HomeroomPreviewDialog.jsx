import React from 'react';
import CommonModal from '../../components/CommonModal';

export default function HomeroomPreviewDialog({ open, values, onConfirm, onCancel }) {
  if (!open) return null;
  const v = values || {};
  return (
    <CommonModal
      open={open}
      title="ยืนยันข้อมูลครูประจำชั้น"
      onClose={onCancel}
      actions={
        <>
          <button onClick={onCancel}>ยกเลิก</button>
          <button onClick={() => onConfirm(v)}>บันทึก</button>
        </>
      }
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
        <div>ปีการศึกษา</div><div>{v.year}</div>
        <div>ระดับการศึกษา</div><div>{v.education_stage}</div>
        <div>ระดับชั้น</div><div>{v.grade}</div>
        <div>ห้องเรียน</div><div>{v.room}</div>
        <div>ตำแหน่ง</div><div>{v.role}</div>
        <div>คุณครูประจำชั้น</div><div>{v.teacher_name}</div>
      </div>
    </CommonModal>
  );
}