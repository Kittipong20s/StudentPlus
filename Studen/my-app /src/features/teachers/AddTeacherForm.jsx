// src/features/teachers/AddTeacherForm.jsx
import React, { useEffect, useState } from 'react';
import { Label, Input, Select, Button } from '../../components/ui/Controls';
import { PREFIXES, validateTeacher, normalizeTeacher } from './teacherSchema'; // ⬅️ เอา POSITIONS ออก
import TeacherApi from './TeacherApi';
import CommonModal from '../../components/CommonModal';
import { toast } from '../../hooks/useToast';

export default function AddTeacherForm({ initialValue, onSubmit, onCancel }) {
  const DEFAULT = {
    teacher_code: '',
    prefix: '',
    first_name: '',
    last_name: '',
    phone: '',
    email: '',
    position: '', // พิมพ์เองได้
  };

  const [v, setV] = useState(DEFAULT);
  const [e, setE] = useState({});
  const [openPreview, setOpenPreview] = useState(false);

  useEffect(() => {
    setV(initialValue ? normalizeTeacher(initialValue) : DEFAULT);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValue]);

  const change = (ev) => {
    const { name, value } = ev.target;
    setV((s) => ({ ...s, [name]: value }));
  };

  // ตรวจซ้ำแบบ local ก่อนเรียก API
  const checkDuplicate = async (payload) => {
    const list = await TeacherApi.list();
    const email = (payload.email || '').toLowerCase();
    const codeDup = list.some((t) => t.teacher_code === payload.teacher_code && t.id !== payload.id);
    const emailDup = list.some((t) => (t.email || '').toLowerCase() === email && t.id !== payload.id);
    return { codeDup, emailDup };
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const payload = normalizeTeacher(v);
    const { codeDup, emailDup } = await checkDuplicate({ ...payload, id: initialValue?.id });

    const errs = validateTeacher(payload, { existsCode: codeDup, existsEmail: emailDup });
    setE(errs);
    if (Object.keys(errs).length) {
      toast({ title: 'กรอกไม่ครบ', message: 'โปรดตรวจสอบฟิลด์ที่มีกรอบแดง', variant: 'error' });
      return;
    }
    setOpenPreview(true);
  };

  const confirm = async () => {
    const payload = normalizeTeacher(v);
    try {
      await onSubmit?.(payload);
      setOpenPreview(false);
    } catch {
      toast({ title: 'ผิดพลาด', message: 'บันทึกข้อมูลไม่สำเร็จ', variant: 'error' });
    }
  };

  const reset = () => { setV(DEFAULT); setE({}); };

  return (
    <>
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 12 }}>
          <div>
            <Label>รหัสประจำตัวคุณครู</Label>
            <Input name="teacher_code" value={v.teacher_code} onChange={change} placeholder="เช่น TR202500123" />
            {e.teacher_code && <div style={{ color: 'red' }}>{e.teacher_code}</div>}
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
            <Input name="first_name" value={v.first_name} onChange={change} placeholder="เช่น สมชาย" />
            {e.first_name && <div style={{ color: 'red' }}>{e.first_name}</div>}
          </div>

          <div>
            <Label>นามสกุล</Label>
            <Input name="last_name" value={v.last_name} onChange={change} placeholder="เช่น ใจดี" />
            {e.last_name && <div style={{ color: 'red' }}>{e.last_name}</div>}
          </div>

          <div>
            <Label>เบอร์โทร</Label>
            <Input name="phone" value={v.phone} onChange={change} placeholder="เช่น 081-234-5678" />
            {e.phone && <div style={{ color: 'red' }}>{e.phone}</div>}
          </div>

          <div>
            <Label>อีเมล</Label>
            <Input
              name="email"
              value={v.email}
              onChange={(e) => setV((s) => ({ ...s, email: e.target.value }))}
              placeholder="เช่น user001@gmail.com"
            />
            {e.email && <div style={{ color: 'red' }}>{e.email}</div>}
          </div>

          <div>
            <Label>ตำแหน่ง</Label>
            {/* เปลี่ยนเป็น Input พิมพ์เอง */}
            <Input name="position" value={v.position} onChange={change} placeholder="เช่น ครูประจำชั้น" />
            {e.position && <div style={{ color: 'red' }}>{e.position}</div>}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="submit">บันทึกข้อมูล</Button>
          <Button type="button" variant="secondary" onClick={reset}>ล้างข้อมูล</Button>
          {onCancel && <Button type="button" variant="secondary" onClick={onCancel}>ยกเลิก</Button>}
        </div>
      </form>

      <CommonModal
        open={openPreview}
        title="ยืนยันข้อมูลคุณครู"
        onClose={() => setOpenPreview(false)}
        actions={
          <>
            <Button variant="secondary" onClick={() => setOpenPreview(false)}>ยกเลิก</Button>
            <Button onClick={confirm}>บันทึก</Button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
          <div>รหัสประจำตัว</div><div>{v.teacher_code}</div>
          <div>คำนำหน้า</div><div>{v.prefix}</div>
          <div>ชื่อ–นามสกุล</div><div>{`${v.first_name} ${v.last_name}`}</div>
          <div>เบอร์โทร</div><div>{v.phone}</div>
          <div>อีเมล</div><div>{normalizeTeacher(v).email}</div>
          <div>ตำแหน่ง</div><div>{v.position}</div>
        </div>
      </CommonModal>
    </>
  );
}