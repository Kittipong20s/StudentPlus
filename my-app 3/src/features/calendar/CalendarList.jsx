// src/features/calendar/CalendarList.jsx
import React from 'react';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Controls';

export default function CalendarList({ items = [], onView, onEdit, onDelete }) {
  const fmtRange = (it) => {
    if (it.type === 'normal') return `${it.open_date} → ${it.close_date} • ${it.time_in}–${it.time_out}`;
    if (it.type === 'holiday') return it.end_date ? `${it.start_date} → ${it.end_date}` : it.start_date;
    if (it.type === 'event')   return `${it.date} • ${it.start_time}–${it.end_time}`;
    return '-';
  };
  const name = (it) => {
    if (it.type === 'normal') return `${it.semester} / ปี ${it.academic_year}`;
    if (it.type === 'holiday') return it.name || 'วันหยุด';
    if (it.type === 'event')   return it.title || 'กิจกรรม';
    return '-';
  };

  return (
    <Card>
      <div className="table-container">
        <table className="table table--compact">
          <thead>
            <tr>
              <th className="col-xs">ประเภท</th>
              <th className="col-md">ชื่อ/รายละเอียด</th>
              <th className="col-lg">ช่วงวัน/เวลา</th>
              <th className="col-md">หมายเหตุ</th>
              <th className="col-actions">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr><td colSpan={5} style={{ textAlign:'center', padding:16 }}>— ไม่มีข้อมูล —</td></tr>
            ) : items.map((it) => (
              <tr key={it.id}>
                <td className="cell">{it.type === 'normal' ? 'วันปกติ' : it.type === 'holiday' ? 'วันหยุด' : 'กิจกรรม'}</td>
                <td className="cell" title={name(it)}>{name(it)}</td>
                <td className="cell" title={fmtRange(it)}>{fmtRange(it)}</td>
                <td className="cell">{it.note || '-'}</td>
                <td className="col-actions">
                  <div className="actions">
                    <Button size="sm" variant="secondary" onClick={() => onView?.(it)}>ดู</Button>
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