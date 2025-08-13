// src/features/teachers/ImportDialog.jsx
import React, { useMemo, useState } from 'react';
import CommonModal from '../../components/CommonModal';
import { Input, Button } from '../../components/ui/Controls';
import * as XLSX from 'xlsx';
import { validateTeacher, normalizeTeacher } from './teacherSchema';
import TeacherApi from './TeacherApi';

// กำหนดคอลัมน์ที่ต้องมี + ป้ายหัวตาราง + ความกว้าง
const COLS = [
  { key: 'ID',        label: 'teacher_code', th: 'รหัสครู',     width: 140 },
  { key: 'Prefix',    label: 'prefix',       th: 'คำนำหน้า',    width: 90  },
  { key: 'FirstName', label: 'first_name',   th: 'ชื่อ',         width: 140 },
  { key: 'LastName',  label: 'last_name',    th: 'นามสกุล',     width: 160 },
  { key: 'Phone',     label: 'phone',        th: 'เบอร์โทร',     width: 140 },
  { key: 'Email',     label: 'email',        th: 'อีเมล',        width: 220 },
  { key: 'Role',      label: 'position',     th: 'ตำแหน่ง',     width: 140 },
];
const REQUIRED_HEADERS = COLS.map(c => c.key);

export default function ImportDialog({ onClose, onImported }) {
  const [rows, setRows] = useState([]); // [{raw:{...}, error:{...}}]
  const [error, setError] = useState('');

  // เติม error กันซ้ำ (ในไฟล์ และชนกับฐานเดิม)
  const applyDuplicateChecks = async (parsedRows) => {
    const existed = await TeacherApi.list();
    const existedCode = new Set(
      existed.map(t => String(t.teacher_code || '').trim())
    );
    const existedEmail = new Set(
      existed.map(t => String(t.email || '').trim().toLowerCase())
    );

    // นับซ้ำในไฟล์
    const countCode = new Map();
    const countEmail = new Map();
    parsedRows.forEach(r => {
      const code = String(r.raw.teacher_code || '').trim();
      const email = String(r.raw.email || '').trim().toLowerCase();
      if (code)  countCode.set(code,  (countCode.get(code)  || 0) + 1);
      if (email) countEmail.set(email, (countEmail.get(email) || 0) + 1);
    });

    const merged = parsedRows.map(r => {
      const code = String(r.raw.teacher_code || '').trim();
      const email = String(r.raw.email || '').trim().toLowerCase();
      const e = { ...(r.error || {}) };

      if (code && countCode.get(code) > 1) e.teacher_code = e.teacher_code || 'รหัสครูซ้ำในไฟล์';
      if (email && countEmail.get(email) > 1) e.email        = e.email        || 'อีเมลซ้ำในไฟล์';

      if (code && existedCode.has(code))  e.teacher_code = e.teacher_code || 'รหัสครูซ้ำกับข้อมูลเดิม';
      if (email && existedEmail.has(email)) e.email       = e.email        || 'อีเมลซ้ำกับข้อมูลเดิม';

      return { raw: r.raw, error: e };
    });

    setRows(merged);
  };

  const handleFile = async (ev) => {
    setError('');
    setRows([]);
    const file = ev.target.files?.[0];
    if (!file) return;

    try {
      if (file.name.toLowerCase().endsWith('.csv')) {
        const text = await file.text();
        const parsed = parseCSV(text);
        await applyDuplicateChecks(parsed);
      } else {
        // .xlsx
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' }); // [{ID:'', Prefix:'', ...}]
        const parsed = parseArrayOfObjects(json);
        await applyDuplicateChecks(parsed);
      }
    } catch (err) {
      console.error(err);
      setError('ไฟล์นำเข้าไม่ถูกต้อง หรืออ่านไม่สำเร็จ');
    }
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).map(s => s.trim());
    if (!lines.filter(Boolean).length) return [];
    const header = (lines[0] || '').split(',').map(h => h.trim());
    const missing = REQUIRED_HEADERS.filter(h => !header.includes(h));
    if (missing.length) throw new Error('หัวคอลัมน์ไม่ครบ: ' + missing.join(', '));

    const idx = Object.fromEntries(header.map((h,i)=>[h,i]));
    const out = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const cols = line.split(',').map(c => c.trim());
      const raw = {};
      COLS.forEach(col => { raw[col.label] = cols[idx[col.key]] ?? ''; });
      const norm = normalizeTeacher(raw);
      out.push({ raw: norm, error: validateTeacher(norm) || {} });
    }
    return out;
  };

  const parseArrayOfObjects = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return [];
    const header = Object.keys(arr[0] || {});
    const missing = REQUIRED_HEADERS.filter(h => !header.includes(h));
    if (missing.length) throw new Error('หัวคอลัมน์ไม่ครบ: ' + missing.join(', '));

    return arr.map(obj => {
      const raw = {};
      COLS.forEach(col => { raw[col.label] = String(obj[col.key] ?? '').trim(); });
      const norm = normalizeTeacher(raw);
      return { raw: norm, error: validateTeacher(norm) || {} };
    });
  };

  const hasError = useMemo(
    () => rows.some(r => Object.keys(r.error || {}).length > 0),
    [rows]
  );

  const confirm = () => {
    const passed = rows.filter(r => Object.keys(r.error || {}).length === 0).map(r => r.raw);
    if (passed.length === 0) {
      setError('ไม่มีแถวที่ผ่านการตรวจสอบ กรุณาแก้ไขก่อนยืนยันนำเข้า');
      return;
    }
    onImported && onImported(passed);
  };

  return (
    <CommonModal
      open
      title="นำเข้าคุณครู (.xlsx / .csv)"
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>ยกเลิก</Button>
          <Button onClick={confirm} disabled={rows.length === 0 || hasError}>ยืนยันนำเข้า</Button>
        </>
      }
    >
      <div className="table-container" style={{ display:'grid', gap:8 }}>
        <Input type="file" accept=".xlsx,.csv" onChange={handleFile} />
        <div style={{ fontSize:12, color:'var(--muted)' }}>
          หัวคอลัมน์ที่ต้องมี: {REQUIRED_HEADERS.join(', ')}
        </div>
        {error && <div style={{ color:'red' }}>{error}</div>}

        <table className="table--preview">
          <colgroup>
            <col style={{ width:52 }} />
            {COLS.map((c,i)=>(<col key={i} style={{ width:c.width }} />))}
            <col style={{ width:220 }} />
          </colgroup>
          <thead>
            <tr>
              <th>#</th>
              {COLS.map(c => <th key={c.key} title={c.key}>{c.th}</th>)}
              <th>สถานะการตรวจสอบ</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={COLS.length+2} style={{ textAlign:'center', padding:16 }}>
                  — ยังไม่มีข้อมูลพรีวิว —
                </td>
              </tr>
            ) : rows.map((r,i)=>{
              const errs = r.error || {};
              const notPass = Object.keys(errs).length > 0;
              const firstKey = Object.keys(errs)[0];
              const firstMsg = firstKey ? `${firstKey}: ${errs[firstKey]}` : '';
              return (
                <tr key={i} style={{ background: notPass ? '#fff7f7' : '#f0fff7' }}>
                  <td>{i+1}</td>
                  {COLS.map(col => {
                    const bad = Object.prototype.hasOwnProperty.call(errs, col.label);
                    return (
                      <td
                        key={col.key}
                        title={String(r.raw[col.label] ?? '')}
                        style={bad ? { outline:'2px solid #fca5a5' } : undefined}
                      >
                        {r.raw[col.label] ?? ''}
                      </td>
                    );
                  })}
                  <td style={{ color:notPass ? '#c00' : 'inherit' }}>
                    {notPass ? `ไม่ผ่าน: ${firstMsg}` : 'ผ่าน'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ fontSize:12, color:'#6b7280' }}>
          ถ้าแถวขึ้นสีชมพู ให้เลื่อนดู—ช่องที่ผิด/ซ้ำจะมีกรอบแดง
        </div>
      </div>
    </CommonModal>
  );
}