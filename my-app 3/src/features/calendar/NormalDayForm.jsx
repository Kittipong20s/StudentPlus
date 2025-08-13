import React, { useEffect, useMemo, useState } from 'react';
import CommonModal from '../../components/CommonModal';
import { Label, Input, Select, Button } from '../../components/ui/Controls';
import CalendarApi from './CalendarApi';
import { toast } from '../../hooks/useToast';

// ===== ค่าคงที่ (นอกคอมโพเนนต์) =====
const TERMS = ['ภาคเรียนที่ 1', 'ภาคเรียนที่ 2'];
const thaiYears = (count = 5) => {
  const base = new Date().getFullYear() + 543;
  return Array.from({ length: count }, (_, i) => String(base + i));
};
const NORMAL_DEFAULT = {
  type: 'normal',
  semester: '',
  academic_year: '',
  open_date: '',
  close_date: '',
  time_in: '',
  time_out: '',
};

export default function NormalDayForm({ open, onClose, onSaved, initialValue }) {
  const isEdit = !!initialValue?.id;
  const YEARS = useMemo(() => thaiYears(5), []);

  const [v, setV] = useState(initialValue || NORMAL_DEFAULT);
  const [e, setE] = useState({});

  // รีเซ็ตฟอร์มเมื่อเปิด/ปิด หรือเมื่อมี initialValue ใหม่
  useEffect(() => {
    setV(initialValue || NORMAL_DEFAULT);
    setE({});
  }, [initialValue, open]);

  const change = (ev) => setV((s) => ({ ...s, [ev.target.name]: ev.target.value }));

  const validate = () => {
    const errs = {};
    if (!v.semester) errs.semester = 'กรุณาเลือกภาคการศึกษา';
    if (!v.academic_year) errs.academic_year = 'กรุณาเลือกปีการศึกษา';
    if (!v.open_date) errs.open_date = 'กรุณาเลือกวันเปิดภาคเรียน';
    if (!v.close_date) errs.close_date = 'กรุณาเลือกวันปิดภาคเรียน';
    if (v.open_date && v.close_date && v.close_date < v.open_date) {
      errs.close_date = 'วันปิดภาคเรียนต้องไม่ก่อนวันเปิดภาคเรียน';
    }
    if (!v.time_in) errs.time_in = 'กรุณาเลือกเวลาเข้าเรียน';
    if (!v.time_out) errs.time_out = 'กรุณาเลือกเวลาเลิกเรียน';
    if (v.time_in && v.time_out && v.time_out <= v.time_in) {
      errs.time_out = 'เวลาเลิกเรียนต้องมากกว่าเวลาเข้าเรียน';
    }
    return errs;
  };

  const submit = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    setE(errs);
    if (Object.keys(errs).length) return;

    try {
      if (isEdit) await CalendarApi.update(initialValue.id, v);
      else        await CalendarApi.create(v);
      toast({ title: 'สำเร็จ', message: 'บันทึกสำเร็จ', variant: 'success' });
      onSaved && onSaved();
    } catch {
      toast({ title: 'ผิดพลาด', message: 'บันทึกไม่สำเร็จ', variant: 'error' });
    }
  };

  return (
    <CommonModal
      open={open}
      title={isEdit ? 'แก้ไขเวลาเข้า–ออก' : 'ตั้งค่าเวลาเข้า–ออก'}
      onClose={onClose}
      actions={
        <>
          <Button variant="secondary" onClick={onClose}>ยกเลิก</Button>
          <Button onClick={submit}>บันทึก</Button>
        </>
      }
    >
      <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
          <div>
            <Label>ภาคการศึกษา</Label>
            <Select name="semester" value={v.semester} onChange={change}>
              <option value="">— เลือก —</option>
              {TERMS.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
            {e.semester && <div style={{ color: 'red' }}>{e.semester}</div>}
          </div>

          <div>
            <Label>ปีการศึกษา</Label>
            <Select name="academic_year" value={v.academic_year} onChange={change}>
              <option value="">— เลือก —</option>
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </Select>
            {e.academic_year && <div style={{ color: 'red' }}>{e.academic_year}</div>}
          </div>

          <div>
            <Label>วันเปิดภาคเรียน</Label>
            <Input type="date" name="open_date" value={v.open_date} onChange={change} />
            {e.open_date && <div style={{ color: 'red' }}>{e.open_date}</div>}
          </div>

          <div>
            <Label>วันปิดภาคเรียน</Label>
            <Input type="date" name="close_date" value={v.close_date} onChange={change} />
            {e.close_date && <div style={{ color: 'red' }}>{e.close_date}</div>}
          </div>

          <div>
            <Label>เวลาเข้าเรียน</Label>
            <Input type="time" name="time_in" value={v.time_in} onChange={change} />
            {e.time_in && <div style={{ color: 'red' }}>{e.time_in}</div>}
          </div>

          <div>
            <Label>เวลาเลิกเรียน</Label>
            <Input type="time" name="time_out" value={v.time_out} onChange={change} />
            {e.time_out && <div style={{ color: 'red' }}>{e.time_out}</div>}
          </div>
        </div>
      </form>
    </CommonModal>
  );
}