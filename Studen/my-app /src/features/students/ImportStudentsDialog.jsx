// src/features/students/ImportStudentsDialog.jsx
import React, { useMemo, useState } from 'react';
import CommonModal from '../../components/CommonModal';
import { Input, Button } from '../../components/ui/Controls';
import * as XLSX from 'xlsx';
import { validateStudentRow } from './studentSchema';
import StudentApi from './StudentApi';

// mapping คีย์/ป้าย/ความกว้าง
const COLS = [
  { key: 'NationalId',     label: 'national_id',     th: 'เลขบัตร',        width: 120 },
  { key: 'StudentId',      label: 'student_id',      th: 'รหัสนักเรียน',    width: 130 },
  { key: 'Prefix',         label: 'prefix',          th: 'คำนำหน้า',        width: 90  },
  { key: 'FirstName',      label: 'first_name',      th: 'ชื่อ',            width: 140 },
  { key: 'LastName',       label: 'last_name',       th: 'นามสกุล',         width: 160 },
  { key: 'BirthDate',      label: 'birth_date',      th: 'วันเกิด',         width: 120 },
  { key: 'EducationStage', label: 'education_stage', th: 'ระดับการศึกษา',   width: 160 },
  { key: 'Grade',          label: 'grade',           th: 'ชั้น',            width: 100 },
  { key: 'Room',           label: 'room',            th: 'ห้อง',            width: 80  },
  { key: 'Address',        label: 'address',         th: 'ที่อยู่',          width: 280, tdClass: 'col-address' },
  { key: 'Phone',          label: 'phone',           th: 'เบอร์โทร',        width: 130 },
  { key: 'Status',         label: 'status',          th: 'สถานะ',           width: 140 },
];

const REQUIRED_HEADERS = COLS.map(c => c.key);

export default function ImportStudentsDialog({ open = true, onClose, onImported }) {
  const [rows, setRows] = useState([]); // [{ raw: {...}, error: {...}}]
  const [error, setError] = useState('');

  // เติม error สำหรับรหัสที่ซ้ำ
  const applyDuplicateChecks = async (parsedRows) => {
    // ชุดรหัสที่มีอยู่ในระบบ
    const exists = await StudentApi.list();
    const existedIds = new Set(exists.map(s => String(s.student_id || '').trim()));

    // นับซ้ำในไฟล์
    const counter = new Map();
    parsedRows.forEach(r => {
      const id = String(r.raw.student_id || '').trim();
      if (!id) return;
      counter.set(id, (counter.get(id) || 0) + 1);
    });

    // ทำสำเนา rows พร้อมอัด error เพิ่ม
    const withDup = parsedRows.map(r => {
      const id = String(r.raw.student_id || '').trim();
      const e = { ...(r.error || {}) };

      if (id) {
        if (counter.get(id) > 1) {
          e.student_id = e.student_id || 'รหัสนักเรียนซ้ำในไฟล์';
        } else if (existedIds.has(id)) {
          e.student_id = e.student_id || 'รหัสนักเรียนซ้ำกับข้อมูลเดิม';
        }
      }
      return { raw: r.raw, error: e };
    });

    setRows(withDup);
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
        const buf = await file.arrayBuffer();
        const wb = XLSX.read(buf, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { defval: '' }); // [{NationalId:..., ...}]
        const parsed = parseArrayOfObjects(json);
        await applyDuplicateChecks(parsed);
      }
    } catch (err) {
      console.error(err);
      setError('ไฟล์นำเข้าไม่ถูกต้อง หรืออ่านไม่สำเร็จ');
    }
  };

  const parseCSV = (text) => {
    const lines = text.split(/\r?\n/).map(l => l.trim());
    if (!lines.filter(Boolean).length) return [];

    const header = (lines[0] || '').split(',').map(h => h.trim());
    const missing = REQUIRED_HEADERS.filter(h => !header.includes(h));
    if (missing.length) throw new Error('หัวคอลัมน์ไม่ครบ: ' + missing.join(', '));

    const idx = Object.fromEntries(header.map((h, i) => [h, i]));
    const out = [];
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line) continue;
      const cols = line.split(',').map(c => c.trim());
      const raw = {};
      COLS.forEach(col => { raw[col.label] = cols[idx[col.key]] ?? ''; });
      out.push({ raw, error: validateStudentRow(raw) || {} });
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
      return { raw, error: validateStudentRow(raw) || {} };
    });
  };

  const hasError = useMemo(() => rows.some(r => Object.keys(r.error || {}).length > 0), [rows]);

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
      open={open}
      title="นำเข้านักเรียน (.xlsx / .csv)"
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>ยกเลิก</Button>
          <Button onClick={confirm} disabled={rows.length === 0 || hasError}>ยืนยันนำเข้า</Button>
        </>
      }
    >
      <div className="table-container" style={{ display: 'grid', gap: 8 }}>
        <Input type="file" accept=".xlsx,.csv" onChange={handleFile} />
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>
          หัวคอลัมน์ที่ต้องมี: {REQUIRED_HEADERS.join(', ')}
        </div>
        {error && <div style={{ color: 'red' }}>{error}</div>}

        <table className="table--preview">
          <colgroup>
            <col style={{ width: 52 }} />
            {COLS.map((c, i) => <col key={i} style={{ width: c.width }} />)}
            <col style={{ width: 220 }} />
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
                <td colSpan={COLS.length + 2} style={{ textAlign: 'center', padding: 16 }}>
                  — ยังไม่มีข้อมูลพรีวิว —
                </td>
              </tr>
            ) : rows.map((r, i) => {
              const errs = r.error || {};
              const notPass = Object.keys(errs).length > 0;
              const firstKey = Object.keys(errs)[0];
              const firstMsg = firstKey ? `${firstKey}: ${errs[firstKey]}` : '';

              return (
                <tr key={i} style={{ background: notPass ? '#fff7f7' : '#f0fff7' }}>
                  <td>{i + 1}</td>
                  {COLS.map(col => {
                    const bad = Object.prototype.hasOwnProperty.call(errs, col.label);
                    return (
                      <td
                        key={col.key}
                        className={col.tdClass || ''}
                        title={String(r.raw[col.label] ?? '')}
                        style={bad ? { outline: '2px solid #fca5a5' } : undefined}
                      >
                        {r.raw[col.label] ?? ''}
                      </td>
                    );
                  })}
                  <td style={{ color: notPass ? '#c00' : 'inherit' }}>
                    {notPass ? `ไม่ผ่าน: ${firstMsg}` : 'ผ่าน'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div style={{ fontSize: 12, color: '#6b7280' }}>
          ถ้าแถวขึ้นสีชมพู ให้เลื่อนดูทางซ้าย—ช่องที่ผิด/ซ้ำจะมีกรอบแดง  
          เคล็ดลับ: ตั้งหัวคอลัมน์ตามตัวอย่างและบันทึกเป็น .xlsx หรือ .csv (UTF-8)
        </div>
      </div>
    </CommonModal>
  );
}