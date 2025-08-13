// src/features/school/SchoolModal.jsx
import React from "react";

export default function SchoolModal({ school, onClose }) {
  if (!school) return null;

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center"
    }}>
      <div style={{ background: "#fff", padding: 20, borderRadius: 8, minWidth: 300 }}>
        <h3>รายละเอียดโรงเรียน</h3>
        <p><b>รหัสโรงเรียน:</b> {school.code}</p>
        <p><b>ชื่อโรงเรียน:</b> {school.name}</p>
        <p><b>ที่อยู่:</b> {school.address}</p>
        <p><b>เบอร์โทร:</b> {school.phone}</p>
        <div style={{ textAlign: "right" }}>
          <button onClick={onClose}>ปิด</button>
        </div>
      </div>
    </div>
  );
}