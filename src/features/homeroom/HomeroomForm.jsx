// src/features/homeroom/HomeroomForm.jsx
import React, { useEffect, useMemo, useState } from 'react';
import CommonModal from '../../components/CommonModal';
import { Label, Input, Select, Button } from '../../components/ui/Controls';
import {
  EDUCATION_STAGES,
  POSITIONS_HM,
  GRADE_OPTIONS,
  nextAcademicYears,
  validateHomeroom,
} from './homeroomSchema';

// ✅ ย้าย DEFAULT ออกนอกคอมโพเนนต์ เพื่อหลบ ESLint missing dependency
const DEFAULT = {
  academic_year: '',
  education_stage: '',
  grade: '',
  room: '',
  position: '',
  teacher_id: '',
};

export default function HomeroomForm({
  initialValue,
  existing = [],       // รายการที่มีอยู่ ใช้ตรวจ duplicate main
  teachers = [],       // รายชื่อครูทั้งหมด [{id, prefix, first_name, last_name}]
  onSubmit,
  onCancel,
}) {
  const [v, setV] = useState(DEFAULT);
  const [e, setE] = useState({});
  const [openPreview, setOpenPreview] = useState(false);

  useEffect(() => {
    setV(initialValue || DEFAULT);
  }, [initialValue]);

  const years = useMemo(() => nextAcademicYears(5), []);
  const grades = useMemo(
    () => (v.education_stage ? GRADE_OPTIONS[v.education_stage] || [] : []),
    [v.education_stage]
  );

  // รายชื่อครูตาม AC:
  // - ถ้าเลือก "ครูประจำชั้นหลัก" => ตัดครูที่เป็นหลักที่ห้องอื่นอยู่แล้ว
  // - ถ้า "ครูประจำชั้นรอง" => แสดงได้ทุกคน
  const teacherOptions = useMemo(() => {
    const list = teachers.map((t) => ({ ...t, name: `${t.prefix} ${t.first_name} ${t.last_name}` }));
    if (v.position !== 'ครูประจำชั้นหลัก') return list;
    const blockedIds = new Set(
      existing
        .filter((it) => it.position === 'ครูประจำชั้นหลัก' && String(it.id) !== String(v.id || ''))
        .map((it) => it.teacher_id)
    );
    return list.filter((t) => !blockedIds.has(t.id));
  }, [teachers, existing, v.position, v.id]);

  const change = (ev) => setV((s) => ({ ...s, [ev.target.name]: ev.target.value }));
  const reset = () => { setV(DEFAULT); setE({}); };

  const submit = (ev) => {
    ev.preventDefault();
    const errs = validateHomeroom(v, existing);
    setE(errs);
    if (Object.keys(errs).length === 0) setOpenPreview(true);
  };

  const confirm = async () => {
    await onSubmit(v);
    setOpenPreview(false);
  };

  return (
    <>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <div>
            <Label>ปีการศึกษา</Label>
            <Select name="academic_year" value={v.academic_year} onChange={change}>
              <option value="">— เลือก —</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </Select>
            {e.academic_year && <div style={{ color: 'red' }}>{e.academic_year}</div>}
          </div>

          <div>
            <Label>ระดับการศึกษา</Label>
            <Select name="education_stage" value={v.education_stage} onChange={change}>
              <option value="">— เลือก —</option>
              {EDUCATION_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
            {e.education_stage && <div style={{ color: 'red' }}>{e.education_stage}</div>}
          </div>

          <div>
            <Label>ระดับชั้น</Label>
            <Select name="grade" value={v.grade} onChange={change} disabled={!v.education_stage}>
              <option value="">— เลือก —</option>
              {grades.map((g) => <option key={g} value={g}>{g}</option>)}
            </Select>
            {e.grade && <div style={{ color: 'red' }}>{e.grade}</div>}
          </div>

          <div>
            <Label>ห้องเรียน</Label>
            <Input name="room" value={v.room} onChange={change} placeholder="เช่น 1" />
            {e.room && <div style={{ color: 'red' }}>{e.room}</div>}
          </div>

          <div>
            <Label>ตำแหน่ง</Label>
            <Select name="position" value={v.position} onChange={change}>
              <option value="">— เลือก —</option>
              {POSITIONS_HM.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
            {e.position && <div style={{ color: 'red' }}>{e.position}</div>}
          </div>

          <div>
            <Label>คุณครูประจำชั้น</Label>
            <Select
              name="teacher_id"
              value={v.teacher_id}
              onChange={change}
              disabled={!v.position}
            >
              <option value="">— เลือก —</option>
              {teacherOptions.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
            {e.teacher_id && <div style={{ color: 'red' }}>{e.teacher_id}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit">บันทึกข้อมูล</Button>
          <Button type="button" variant="secondary" onClick={reset}>ล้างข้อมูล</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>ยกเลิก</Button>
        </div>
      </form>

      <CommonModal
        open={openPreview}
        title="ยืนยันการกำหนดครูประจำชั้น"
        onClose={() => setOpenPreview(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpenPreview(false)}>ยกเลิก</Button>
            <Button onClick={confirm}>บันทึก</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
          <div>ปีการศึกษา</div><div>{v.academic_year}</div>
          <div>ระดับการศึกษา</div><div>{v.education_stage}</div>
          <div>ระดับชั้น</div><div>{v.grade}</div>
          <div>ห้องเรียน</div><div>{v.room}</div>
          <div>ตำแหน่ง</div><div>{v.position}</div>
          <div>คุณครูประจำชั้น</div>
          <div>{teacherOptions.find(t => String(t.id) === String(v.teacher_id))?.name || '-'}</div>
        </div>
      </CommonModal>
    </>
  );
}