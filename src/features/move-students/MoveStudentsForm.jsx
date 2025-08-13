// src/features/move-students/MoveStudentsForm.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { Label, Input, Select, Button, Textarea } from '../../components/ui/Controls';
import StudentApi from '../students/StudentApi';
import { validateMove } from './moveStudentsSchema';
import CommonModal from '../../components/CommonModal';
import { toast } from '../../hooks/useToast';

function ygr(year, grade, room) { return `${year || '-'}–${grade || '-'}-${room || '-'}`; }

export default function MoveStudentsForm({ initialValue, onMoved, onCancel }) {
  const [students, setStudents] = useState([]);

  // ค้นหา (debounce)
  const [qRaw, setQRaw] = useState('');
  const [q, setQ] = useState('');

  // ฟิลด์หลัก
  const [selected, setSelected] = useState([]);  // ids
  const [fromGrade, setFromGrade] = useState('');
  const [fromRoom, setFromRoom] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [note, setNote] = useState('');
  const [e, setE] = useState({});
  const [openConfirm, setOpenConfirm] = useState(false);

  // โหลดนักเรียน
  useEffect(() => {
    (async () => {
      const list = await StudentApi.list();
      setStudents(list);
    })();
  }, []);

  // preload กรณีแก้ไข
  useEffect(() => {
    if (!initialValue) return;
    setQRaw('');
    setQ('');
    setSelected(initialValue.students?.map(s => s.id) || []);
    setFromGrade(initialValue.fromGrade || initialValue.grade || '');
    setFromRoom(initialValue.fromRoom || initialValue.room || '');
    setNewRoom(initialValue.toRoom || '');
    setMoveDate(initialValue.moveDate || '');
    setNote(initialValue.note || '');
  }, [initialValue]);

  // debounce ค้นหา 300ms
  useEffect(() => {
    const t = setTimeout(() => setQ(qRaw.trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [qRaw]);

  // ลิสต์ที่กรองตามชั้น/ห้องเดิมก่อน (ให้ผู้ใช้กำหนด “ชั้น–ห้องเดิม” ก่อน)
  const baseFiltered = useMemo(() => {
    let list = students;
    if (fromGrade && fromRoom) {
      list = list.filter(s => (s.grade === fromGrade && String(s.room) === String(fromRoom)));
    } else {
      // ถ้ายังไม่ระบุห้องเดิม → ไม่แสดงรายการ (กันสับสน)
      list = [];
    }
    return list;
  }, [students, fromGrade, fromRoom]);

  // กรองต่อด้วยคำค้น (AND)
  const filtered = useMemo(() => {
    if (!q) return baseFiltered;
    const terms = q.split(/\s+/).filter(Boolean);
    return baseFiltered.filter(s => {
      const hay = [s.student_id, s.first_name, s.last_name].join(' ').toLowerCase();
      return terms.every(t => hay.includes(t));
    });
  }, [q, baseFiltered]);

  // ปีไทย และแสดงสรุป
  const thaiYear = String(new Date().getFullYear() + 543);
  const fromDisplay = ygr(thaiYear, fromGrade, fromRoom);
  const toDisplay = ygr(thaiYear, fromGrade, newRoom);

  // Select All ในชุดที่กรองแล้ว
  const allIds = filtered.map(s => s.id);
  const allSelected = allIds.length > 0 && allIds.every(id => selected.includes(id));
  const toggleAll = (checked) => {
    if (checked) setSelected(prev => Array.from(new Set([...prev, ...allIds])));
    else setSelected(prev => prev.filter(id => !allIds.includes(id)));
  };
  const toggleRow = (id, checked) => {
    setSelected(prev => checked ? [...prev, id] : prev.filter(x => x !== id));
  };

  // ปุ่มย้าย: ตรวจครบหรือยัง
  const canSubmit = useMemo(() => {
    const payload = {
      selected: students.filter(s => selected.includes(s.id)),
      newRoom, moveDate, fromGrade, fromRoom
    };
    const errs = validateMove(payload);
    return Object.keys(errs).length === 0;
  }, [students, selected, newRoom, moveDate, fromGrade, fromRoom]);

  // กด “ย้าย” → เปิดสรุปก่อน
  const handleSubmit = (ev) => {
    ev.preventDefault();
    const payload = {
      selected: students.filter(s => selected.includes(s.id)),
      newRoom, moveDate, fromGrade, fromRoom
    };
    const errs = validateMove(payload);
    setE(errs);
    if (Object.keys(errs).length) {
      toast({ title: 'กรอกไม่ครบ', message: 'กรุณาตรวจสอบข้อมูลที่ต้องกรอก', variant: 'error' });
      return;
    }
    setOpenConfirm(true);
  };

  // ยืนยันใน Modal แล้วค่อยส่งให้ parent
  const confirmMove = () => {
    const payload = {
      moveDate,
      fromYear: thaiYear,
      fromGrade,
      fromRoom,
      toYear: thaiYear,
      toGrade: fromGrade,
      toRoom: newRoom,
      fromDisplay,
      toDisplay,
      students: students.filter(s => selected.includes(s.id)),
      count: selected.length,
      note,
    };
    onMoved && onMoved(payload);
    setOpenConfirm(false);
  };

  // ยูทิลสำหรับคอมโบบางอัน
  const GRADE_LIST = [
    'อนุบาล 1','อนุบาล 2','อนุบาล 3',
    'ประถม 1','ประถม 2','ประถม 3','ประถม 4','ประถม 5','ประถม 6',
    'มัธยม 1','มัธยม 2','มัธยม 3','มัธยม 4','มัธยม 5','มัธยม 6'
  ];

  return (
    <>
      {/* Step hint */}
      <div className="card" style={{ marginBottom: 8, background: '#f8fafc' }}>
        <ol style={{ margin: 0, padding: '8px 12px', display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 13 }}>
          <li>เลือก <b>ชั้น–ห้องเดิม</b></li>
          <li>ค้นหา/ติ๊กเลือก <b>นักเรียน</b></li>
          <li>ระบุ <b>ห้องใหม่</b> และ <b>วันที่ย้าย</b></li>
          <li>กด <b>ย้าย</b></li>
        </ol>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        {/* แถวตัวกรอง/กำหนดห้องเดิม-ใหม่ */}
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:12 }}>
          <div>
            <Label>ค้นหานักเรียน</Label>
            <Input
              placeholder={fromGrade && fromRoom ? 'พิมพ์รหัสนักเรียน หรือชื่อ' : 'กรุณาเลือกชั้น–ห้องเดิมก่อน'}
              value={qRaw}
              onChange={(e)=>setQRaw(e.target.value)}
              disabled={!fromGrade || !fromRoom}
            />
          </div>

          <div>
            <Label>ชั้น–ห้อง (เดิม)</Label>
            <div style={{ display:'flex', gap:8 }}>
              <Select value={fromGrade} onChange={(e)=>{ setFromGrade(e.target.value); setSelected([]); }}>
                <option value="">— ชั้น —</option>
                {GRADE_LIST.map(g=><option key={g} value={g}>{g}</option>)}
              </Select>
              <Input
                placeholder="ห้อง"
                value={fromRoom}
                onChange={(e)=>{ setFromRoom(e.target.value); setSelected([]); }}
              />
            </div>
          </div>

          <div>
            <Label>ห้องเรียนใหม่</Label>
            <Input placeholder="ห้องใหม่ (ตัวเลข)" value={newRoom} onChange={(e)=>setNewRoom(e.target.value)} />
            {e.newRoom && <div style={{ color:'red' }}>{e.newRoom}</div>}
          </div>

          <div>
            <Label>วันที่ย้าย</Label>
            <Input type="date" value={moveDate} onChange={(e)=>setMoveDate(e.target.value)} />
            {e.moveDate && <div style={{ color:'red' }}>{e.moveDate}</div>}
          </div>
        </div>

        {/* Summary bar */}
        <div className="card" style={{ padding:'10px 12px', display:'flex', gap:12, alignItems:'center', border:'1px solid #eee' }}>
          <div><b>ห้องเดิม:</b> {fromDisplay}</div>
          <div><b>ห้องใหม่:</b> {toDisplay}</div>
          <div style={{ marginLeft:'auto' }}><b>เลือกแล้ว:</b> {selected.length} คน</div>
        </div>

        {/* ตารางเลือกนักเรียน */}
        <div className="table-container">
          <table className="table table--compact table--dense">
            <thead>
              <tr>
                <th style={{ width:48, textAlign:'center' }}>
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e)=>toggleAll(e.target.checked)}
                    disabled={filtered.length===0}
                    title={filtered.length===0 ? 'เลือกห้องเดิมก่อน' : 'เลือกทั้งหมด'}
                  />
                </th>
                <th className="col-sm">รหัสนักเรียน</th>
                <th className="col-lg">ชื่อ–นามสกุล</th>
                <th className="col-sm">ชั้น</th>
                <th className="col-xs">ห้อง</th>
              </tr>
            </thead>
            <tbody>
              {(!fromGrade || !fromRoom) ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:16 }}>— โปรดเลือก “ชั้น–ห้องเดิม” ก่อน —</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ textAlign:'center', padding:16 }}>— ไม่พบนักเรียน —</td></tr>
              ) : filtered.map(s => {
                const checked = selected.includes(s.id);
                return (
                  <tr key={s.id}>
                    <td style={{ textAlign:'center' }}>
                      <input type="checkbox" checked={checked} onChange={(e)=>toggleRow(s.id, e.target.checked)} />
                    </td>
                    <td className="cell">{s.student_id}</td>
                    <td className="cell">{`${s.first_name} ${s.last_name}`}</td>
                    <td className="cell">{s.grade}</td>
                    <td className="cell">{s.room}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* หมายเหตุ */}
        <div>
          <Label>หมายเหตุ</Label>
          <Textarea rows={2} value={note} onChange={(e)=>setNote(e.target.value)} placeholder="(ถ้ามี)" />
        </div>

        {/* ปุ่ม */}
        <div style={{ display:'flex', gap:8 }}>
          <Button type="submit" disabled={!canSubmit} title={!canSubmit ? 'กรุณาเลือกนักเรียนอย่างน้อย 1 คน, เลือกห้องใหม่ และวันที่ย้าย' : ''}>
            ย้าย
          </Button>
          {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>ยกเลิก</Button>}
        </div>
      </form>

      {/* Modal ยืนยันก่อนย้าย */}
      <CommonModal
        open={openConfirm}
        title="ยืนยันการย้ายห้องเรียน"
        onClose={() => setOpenConfirm(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpenConfirm(false)}>ยกเลิก</Button>
            <Button onClick={confirmMove}>ยืนยัน</Button>
          </>
        }
      >
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:8 }}>
          <div>วันที่ย้าย</div><div>{moveDate || '-'}</div>
          <div>ห้องเดิม</div><div>{fromDisplay}</div>
          <div>ห้องใหม่</div><div>{toDisplay}</div>
          <div>จำนวน</div><div>{selected.length} คน</div>
          <div style={{ gridColumn:'1 / -1', marginTop:8 }}>
            <div style={{ fontWeight:600, marginBottom:4 }}>รายชื่อนักเรียน</div>
            <ul style={{ margin:0, paddingLeft:18, maxHeight:180, overflow:'auto' }}>
              {students.filter(s => selected.includes(s.id)).map(s => (
                <li key={s.id}>{s.student_id} — {s.first_name} {s.last_name}</li>
              ))}
            </ul>
          </div>
        </div>
      </CommonModal>
    </>
  );
}