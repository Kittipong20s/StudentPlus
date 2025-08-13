import React, { useEffect, useMemo, useState } from 'react';
import CommonModal from '../../components/CommonModal';
import { Label, Input, Select, TextArea, Button } from '../../components/ui/Controls';
import {
  PREFIXES,
  EDUCATION_STAGES,
  STATUS_OPTIONS,
  GRADE_OPTIONS,
  validateStudent,
  getSchoolEducationStage,
} from './studentSchema';

const DEFAULT_FORM = {
  national_id: '',
  student_id: '',
  prefix: '',
  first_name: '',
  last_name: '',
  birth_date: '',
  education_stage: '',
  grade: '',
  room: '',
  address: '',
  phone: '',
  status: '',
};

export default function StudentForm({ initialValue, onSaved, onCancel }) {
  const [v, setV] = useState(DEFAULT_FORM);
  const [e, setE] = useState({});
  const [openPreview, setOpenPreview] = useState(false);

  // preload ค่าเริ่มจากหน้า "เพิ่มโรงเรียน" ถ้ามี
  useEffect(() => {
    const init = { ...(initialValue || DEFAULT_FORM) };
    if (!initialValue) {
      const stage = getSchoolEducationStage();
      if (stage) init.education_stage = stage;
    }
    setV(init);
  }, [initialValue]);

  const grades = useMemo(() => (v.education_stage ? GRADE_OPTIONS[v.education_stage] || [] : []), [v.education_stage]);

  const change = (ev) => setV((s) => ({ ...s, [ev.target.name]: ev.target.value }));
  const reset = () => { setV(DEFAULT_FORM); setE({}); };

  const submit = (ev) => {
    ev.preventDefault();
    const errs = validateStudent(v);
    setE(errs);
    if (Object.keys(errs).length === 0) setOpenPreview(true);
  };

  const confirm = async () => { await onSaved(v); setOpenPreview(false); };

  return (
    <>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <div>
            <Label>เลขบัตรประชาชน</Label>
            <Input name="national_id" value={v.national_id} onChange={change} />
            {e.national_id && <div style={{ color: 'red' }}>{e.national_id}</div>}
          </div>
          <div>
            <Label>รหัสนักเรียน</Label>
            <Input name="student_id" value={v.student_id} onChange={change} />
            {e.student_id && <div style={{ color: 'red' }}>{e.student_id}</div>}
          </div>
          <div>
            <Label>คำนำหน้า</Label>
            <Select name="prefix" value={v.prefix} onChange={change}>
              <option value="">— เลือก —</option>
              {PREFIXES.map((p) => <option key={p} value={p}>{p}</option>)}
            </Select>
            {e.prefix && <div style={{ color: 'red' }}>{e.prefix}</div>}
          </div>
          <div>
            <Label>ชื่อ</Label>
            <Input name="first_name" value={v.first_name} onChange={change} />
            {e.first_name && <div style={{ color: 'red' }}>{e.first_name}</div>}
          </div>
          <div>
            <Label>นามสกุล</Label>
            <Input name="last_name" value={v.last_name} onChange={change} />
            {e.last_name && <div style={{ color: 'red' }}>{e.last_name}</div>}
          </div>
          <div>
            <Label>วัน/เดือน/ปี เกิด</Label>
            <Input type="date" name="birth_date" value={v.birth_date} onChange={change} />
            {e.birth_date && <div style={{ color: 'red' }}>{e.birth_date}</div>}
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
            <Label>ห้อง</Label>
            <Input name="room" value={v.room} onChange={change} />
            {e.room && <div style={{ color: 'red' }}>{e.room}</div>}
          </div>
          <div>
            <Label>เบอร์โทร</Label>
            <Input name="phone" value={v.phone} onChange={change} />
            {e.phone && <div style={{ color: 'red' }}>{e.phone}</div>}
          </div>
        </div>

        <div>
          <Label>ที่อยู่</Label>
          <TextArea name="address" value={v.address} onChange={change} />
          {e.address && <div style={{ color: 'red' }}>{e.address}</div>}
        </div>

        <div>
          <Label>สถานะ</Label>
          <Select name="status" value={v.status} onChange={change}>
            <option value="">— เลือก —</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
          {e.status && <div style={{ color: 'red' }}>{e.status}</div>}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit">บันทึกข้อมูล</Button>
          <Button type="button" variant="secondary" onClick={reset}>ล้างข้อมูล</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>ยกเลิก</Button>
        </div>
      </form>

      {/* Preview Modal */}
      <CommonModal
        open={openPreview}
        title="ยืนยันข้อมูลนักเรียน"
        onClose={() => setOpenPreview(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpenPreview(false)}>ยกเลิก</Button>
            <Button onClick={confirm}>บันทึก</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
          <div>เลขบัตรประชาชน</div><div>{v.national_id}</div>
          <div>รหัสนักเรียน</div><div>{v.student_id}</div>
          <div>คำนำหน้า</div><div>{v.prefix}</div>
          <div>ชื่อ</div><div>{v.first_name}</div>
          <div>นามสกุล</div><div>{v.last_name}</div>
          <div>วันเกิด</div><div>{v.birth_date}</div>
          <div>ระดับการศึกษา</div><div>{v.education_stage}</div>
          <div>ระดับชั้น</div><div>{v.grade}</div>
          <div>ห้อง</div><div>{v.room}</div>
          <div>ที่อยู่</div><div style={{ whiteSpace: 'pre-wrap' }}>{v.address}</div>
          <div>เบอร์โทร</div><div>{v.phone}</div>
          <div>สถานะ</div><div>{v.status}</div>
        </div>
      </CommonModal>
    </>
  );
}