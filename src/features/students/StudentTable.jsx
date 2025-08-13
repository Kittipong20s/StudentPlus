// src/features/students/StudentTable.jsx
import React from 'react';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Controls';

export default function StudentTable(props) {
  const rows = Array.isArray(props.items) ? props.items
              : Array.isArray(props.data)  ? props.data
              : [];

  const { onView, onEdit, onDelete } = props;

  return (
    <Card>
      <div className="table-container">
        <table className="table table--compact table--dense">
          <thead>
            <tr>
              <th className="col-sm">รหัสนักเรียน</th>
              <th className="col-xs">คำนำหน้า</th>
              <th className="col-md">ชื่อ–นามสกุล</th>
              <th className="col-xs">ชั้น</th>
              <th className="col-xxs">ห้อง</th>
              <th className="col-sm">สถานะ</th>
              <th className="col-actions">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:16 }}>— ไม่มีข้อมูล —</td></tr>
            ) : rows.map((s) => (
              <tr key={s.id ?? s.student_id}>
                <td className="cell">{s.student_id ?? '-'}</td>
                <td className="cell">{s.prefix ?? '-'}</td>
                <td className="cell">{[s.first_name, s.last_name].filter(Boolean).join(' ') || '-'}</td>
                <td className="cell">{s.grade ?? '-'}</td>
                <td className="cell">{s.room ?? '-'}</td>
                <td className="cell">{s.status ?? '-'}</td>
                <td className="col-actions">
                  <div className="actions">
                    {onView && <Button size="sm" variant="secondary" onClick={() => onView(s)}>ดู</Button>}
                    <Button size="sm" onClick={() => onEdit?.(s)}>แก้ไข</Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete?.(s.id)}>ลบ</Button>
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