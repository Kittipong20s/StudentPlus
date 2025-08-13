// src/features/homeroom/HomeroomTable.jsx
import React from 'react';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Controls';

export default function HomeroomTable(props) {
  // รองรับทั้ง items และ data
  const rows = Array.isArray(props.items) ? props.items
              : Array.isArray(props.data)  ? props.data
              : [];

  const { onView, onEdit, onDelete } = props;

  // hint เล็กๆ ช่วยไล่ปัญหาถ้าไม่พบข้อมูล
  let hint = '';
  try {
    const raw = localStorage.getItem('homerooms'); // ✅ ยึดตาม HomeroomApi
    const ls = raw ? JSON.parse(raw) : null;
    if (rows.length === 0) {
      if (Array.isArray(ls) && ls.length > 0) {
        hint = 'มีข้อมูลใน localStorage แต่ข้อมูลที่ส่งเข้า Table เป็น 0 แถว (ตรวจ load/filter/prop name)';
      } else {
        hint = 'ยังไม่พบข้อมูลกำหนดครู (ตรวจ seedMocks หรือ HomeroomApi.list())';
      }
    }
  } catch { /* noop */ }

  return (
    <Card>
      <div className="table-container">
        <table className="table table--compact table--dense">
          <thead>
            <tr>
              <th className="hm-year">ปี</th>
              <th className="hm-stage">ระดับ</th>
              <th className="hm-grade">ชั้น</th>
              <th className="hm-room">ห้อง</th>
              <th className="hm-pos">ตำแหน่ง</th>
              <th className="hm-teacher">ครูประจำชั้น</th>
              <th className="col-actions">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 16 }}>
                  — ไม่มีข้อมูล —
                  {hint && (
                    <div style={{ marginTop: 6, fontSize: 12, color: '#6b7280' }}>{hint}</div>
                  )}
                </td>
              </tr>
            ) : rows.map((it, idx) => (
              <tr key={it.id ?? `${it.academic_year}-${it.grade}-${it.room}-${idx}`}>
                <td className="cell">{it.academic_year ?? '-'}</td>
                <td className="cell">{it.education_stage ?? '-'}</td>
                <td className="cell">{it.grade ?? '-'}</td>
                <td className="cell">{it.room ?? '-'}</td>
                <td className="cell">{it.position ?? '-'}</td>
                <td className="cell" title={it.teacher_name}>{it.teacher_name ?? '-'}</td>
                <td className="col-actions">
                  <div className="actions">
                    {onView && <Button size="sm" variant="secondary" onClick={() => onView(it)}>ดู</Button>}
                    <Button size="sm" onClick={() => onEdit?.(it)}>แก้ไข</Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete?.(it.id)}>ลบ</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}