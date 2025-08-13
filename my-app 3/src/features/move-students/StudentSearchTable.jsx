import React from 'react';
import { Button } from '../../components/ui/Controls';

function joinYGR(year, grade, room) {
  const y = (year ?? '').toString().trim();
  const g = (grade ?? '').toString().trim();
  const r = (room ?? '').toString().trim();
  if (!y && !g && !r) return '';
  return `${y || '-'}–${g || '-'}-${r || '-'}`;
}

function normalizeMove(r, index) {
  const moveDate = r.moveDate || r.date || r.moved_at || r.movedDate || r.when || '';

  const fromYear  = r.fromYear  ?? r.yearFrom   ?? r.academic_year_from ?? r.year   ?? '';
  const fromGrade = r.fromGrade ?? r.gradeFrom  ?? r.from_grade         ?? r.grade  ?? '';
  const fromRoom  = r.fromRoom  ?? r.roomFrom   ?? r.from_room          ?? r.room   ?? '';
  const toYear    = r.toYear    ?? r.yearTo     ?? r.academic_year_to   ?? r.year2  ?? fromYear;
  const toGrade   = r.toGrade   ?? r.gradeTo    ?? r.to_grade           ?? r.grade2 ?? fromGrade;
  const toRoom    = r.toRoom    ?? r.roomTo     ?? r.to_room            ?? r.room2  ?? '';

  const fromDisplay = r.fromDisplay || joinYGR(fromYear, fromGrade, fromRoom);
  const toDisplay   = r.toDisplay   || joinYGR(toYear, toGrade, toRoom);

  const count =
    r.count ??
    (Array.isArray(r.students) ? r.students.length : undefined) ??
    (Array.isArray(r.selected) ? r.selected.length : undefined) ??
    r.studentCount ??
    r.total ??
    0;

  return {
    id: r.id ?? r.move_id ?? `mv_${index}`,
    moveDate: moveDate || '-',
    fromDisplay: fromDisplay || '-',
    toDisplay: toDisplay || '-',
    count,
    note: r.note || r.remark || '',
    _raw: r,
  };
}

export default function MoveStudentsTable({ data = [], onView, onEdit, onDelete }) {
  const rows = (Array.isArray(data) ? data : []).map(normalizeMove);

  return (
    <div className="table-container">
      <table className="table table--compact">
        <colgroup>
          <col style={{ width: 160 }} />
          <col style={{ width: 280 }} />
          <col style={{ width: 280 }} />
          <col style={{ width: 120 }} />
          <col style={{ width: 220 }} />
        </colgroup>
        <thead>
          <tr>
            <th>วันที่ย้าย</th>
            <th>เดิม (ปี–ชั้น–ห้อง)</th>
            <th>ใหม่ (ปี–ชั้น–ห้อง)</th>
            <th>จำนวน</th>
            <th className="col-actions">การจัดการ</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign:'center', padding:16 }}>— ไม่มีข้อมูล —</td></tr>
          ) : rows.map((r) => (
            <tr key={r.id}>
              <td className="cell">{r.moveDate}</td>
              <td className="cell" title={r.fromDisplay}>{r.fromDisplay}</td>
              <td className="cell" title={r.toDisplay}>{r.toDisplay}</td>
              <td className="cell">{r.count}</td>
              <td className="col-actions">
                <div className="actions">
                  {onView && <Button size="sm" variant="secondary" onClick={() => onView(r)}>ดู</Button>}
                  {onEdit && <Button size="sm" onClick={() => onEdit(r)}>แก้ไข</Button>}
                  <Button size="sm" variant="danger" onClick={() => onDelete?.(r.id)}>ลบ</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}