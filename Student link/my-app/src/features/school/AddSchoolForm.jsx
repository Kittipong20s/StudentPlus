// src/features/school/AddSchoolForm.jsx
import React, { useEffect, useState } from 'react';
import CommonModal from '../../components/CommonModal';
import { EDUCATION_LEVELS, validateSchool } from './schoolSchema';
import { Label, Input, Select, TextArea, Button } from '../../components/ui/Controls';

const DEFAULT_FORM = { school_code:'', school_name:'', address:'', phone:'', education_level:'' };

export default function AddSchoolForm({ initialValue, onSaved, onCancel }) {
  const [v, setV] = useState(DEFAULT_FORM);
  const [e, setE] = useState({});
  const [openPreview, setOpenPreview] = useState(false);

  useEffect(() => { setV(initialValue || DEFAULT_FORM); }, [initialValue]);

  const change = (ev) => setV(s => ({ ...s, [ev.target.name]: ev.target.value }));
  const reset = () => { setV(DEFAULT_FORM); setE({}); };

  const submit = (ev) => {
    ev.preventDefault();
    const errs = validateSchool(v);
    setE(errs);
    if (Object.keys(errs).length === 0) setOpenPreview(true);
  };

  const confirm = async () => { await onSaved(v); setOpenPreview(false); };

  return (
    <>
      <form onSubmit={submit} style={{ display:'grid', gap:12 }}>
        <div>
          <Label>รหัสโรงเรียน</Label>
          <Input name="school_code" value={v.school_code} onChange={change} />
          {e.school_code && <div style={{color:'red'}}>{e.school_code}</div>}
        </div>
        <div>
          <Label>ชื่อโรงเรียน</Label>
          <Input name="school_name" value={v.school_name} onChange={change} />
          {e.school_name && <div style={{color:'red'}}>{e.school_name}</div>}
        </div>
        <div>
          <Label>ที่อยู่</Label>
          <TextArea name="address" value={v.address} onChange={change} />
          {e.address && <div style={{color:'red'}}>{e.address}</div>}
        </div>
        <div>
          <Label>เบอร์โทรศัพท์</Label>
          <Input name="phone" value={v.phone} onChange={change} />
          {e.phone && <div style={{color:'red'}}>{e.phone}</div>}
        </div>
        <div>
          <Label>ระดับการสอน</Label>
          <Select name="education_level" value={v.education_level} onChange={change}>
            <option value="">— เลือก —</option>
            {EDUCATION_LEVELS.map((lv) => <option key={lv} value={lv}>{lv}</option>)}
          </Select>
          {e.education_level && <div style={{color:'red'}}>{e.education_level}</div>}
        </div>

        <div style={{ display:'flex', gap:8 }}>
          <Button type="submit">บันทึกข้อมูล</Button>
          <Button type="button" variant="secondary" onClick={reset}>ล้างข้อมูล</Button>
          <Button type="button" variant="secondary" onClick={onCancel}>ยกเลิก</Button>
        </div>
      </form>

      <CommonModal
        open={openPreview}
        title="ยืนยันข้อมูลโรงเรียน"
        onClose={() => setOpenPreview(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpenPreview(false)}>ยกเลิก</Button>
            <Button onClick={confirm}>บันทึก</Button>
          </>
        }
      >
        <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:8 }}>
          <div>รหัสโรงเรียน</div><div>{v.school_code}</div>
          <div>ชื่อโรงเรียน</div><div>{v.school_name}</div>
          <div>ที่อยู่</div><div style={{ whiteSpace:'pre-wrap' }}>{v.address}</div>
          <div>เบอร์โทรศัพท์</div><div>{v.phone}</div>
          <div>ระดับการสอน</div><div>{v.education_level}</div>
        </div>
      </CommonModal>
    </>
  );
}