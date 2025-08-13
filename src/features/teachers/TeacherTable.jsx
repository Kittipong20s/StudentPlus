// src/features/teachers/TeacherTable.jsx
import React from 'react';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Controls';

export default function TeacherTable(props) {
  const rows = Array.isArray(props.items) ? props.items
              : Array.isArray(props.data) ? props.data
              : [];
  const { onView, onEdit, onDelete } = props;

  return (
    <Card>
      <div className="table-container">
        {/* ทำให้หัวข้อแน่นขึ้นด้วย table--dense */}
        <table className="table table--compact table--teachers table--dense">
          <thead>
            <tr>
              <th className="tt-code">รหัสครู</th>
              <th className="tt-prefix">คำนำหน้า</th>
              <th className="tt-name">ชื่อ–นามสกุล</th>
              <th className="tt-phone">เบอร์โทร</th>
              <th className="tt-email">อีเมล</th>
              <th className="tt-pos">ตำแหน่ง</th>
              <th className="col-actions">การจัดการ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={7} style={{ textAlign:'center', padding:16 }}>— ไม่มีข้อมูล —</td></tr>
            ) : rows.map(t => (
              <tr key={t.id ?? t.teacher_code}>
                <td className="cell">{t.teacher_code ?? '-'}</td>
                <td className="cell">{t.prefix ?? '-'}</td>
                <td className="cell">{[t.first_name, t.last_name].filter(Boolean).join(' ') || '-'}</td>
                <td className="cell">{t.phone ?? '-'}</td>
                <td className="cell">{t.email ?? '-'}</td>
                <td className="cell">{t.position ?? '-'}</td>
                <td className="col-actions">
                  <div className="actions">
                    <Button size="sm" variant="secondary" onClick={() => onView?.(t)}>ดู</Button>
                    <Button size="sm" onClick={() => onEdit?.(t)}>แก้ไข</Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete?.(t.id)}>ลบ</Button>
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