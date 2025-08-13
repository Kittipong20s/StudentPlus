import React, { useEffect, useState } from 'react';
import CommonModal from '../../components/CommonModal';
import { Label, Input, Select, Textarea, Button } from '../../components/ui/Controls';
import CalendarApi from './CalendarApi';
import { toast } from '../../hooks/useToast';

// ===== ค่าคงที่ (นอกคอมโพเนนต์) =====
const HOLIDAY_TYPES = ['วันปีใหม่', 'วันสงกรานต์', 'วันแรงงาน', 'วันเด็ก', 'อื่นๆ'];
const HOLIDAY_DEFAULT = {
  type: 'holiday',
  name: '',
  start_date: '',
  end_date: '',
  note: '',
};

export default function HolidayForm({ open, onClose, onSaved, initialValue }) {
  const isEdit = !!initialValue?.id;

  const [v, setV] = useState(initialValue || HOLIDAY_DEFAULT);
  const [e, setE] = useState({});

  useEffect(() => {
    setV(initialValue || HOLIDAY_DEFAULT);
    setE({});
  }, [initialValue, open]);

  const change = (ev) => setV((s) => ({ ...s, [ev.target.name]: ev.target.value }));

  const validate = () => {
    const errs = {};
    if (!v.start_date) errs.start_date = 'กรุณาเลือกวันที่เริ่มต้น';
    if (v.end_date && v.end_date < v.start_date) errs.end_date = 'วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น';
    if (!v.name) errs.name = 'กรุณาเลือก/กรอกชื่อวันหยุด';
    if (v.note && v.note.length > 200) errs.note = 'หมายเหตุไม่เกิน 200 ตัวอักษร';
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

  const selectValue = HOLIDAY_TYPES.includes(v.name)
    ? v.name
    : (v.name ? 'อื่นๆ' : '');

  return (
    <CommonModal
      open={open}
      title={isEdit ? 'แก้ไขวันหยุด' : 'เพิ่มวันหยุด'}
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
            <Label>วันที่เริ่มต้น</Label>
            <Input type="date" name="start_date" value={v.start_date} onChange={change} />
            {e.start_date && <div style={{ color: 'red' }}>{e.start_date}</div>}
          </div>

          <div>
            <Label>วันที่สิ้นสุด (ถ้าเว้นไว้ = 1 วัน)</Label>
            <Input type="date" name="end_date" value={v.end_date} onChange={change} />
            {e.end_date && <div style={{ color: 'red' }}>{e.end_date}</div>}
          </div>

          <div>
            <Label>ประเภทวันหยุด</Label>
            <Select
              value={selectValue}
              onChange={(e) => {
                const val = e.target.value;
                setV((s) => ({ ...s, name: val === 'อื่นๆ' ? '' : val }));
              }}
            >
              <option value="">— เลือก —</option>
              {HOLIDAY_TYPES.map((h) => <option key={h} value={h}>{h}</option>)}
            </Select>
            {/* แสดงช่องกรอกเองเมื่อเลือก "อื่นๆ" หรือยังไม่มีค่า */}
            {(!HOLIDAY_TYPES.includes(v.name) || v.name === '') && (
              <>
                <Label style={{ marginTop: 8 }}>ชื่อวันหยุด (กรณีอื่นๆ)</Label>
                <Input name="name" value={v.name} onChange={change} placeholder="เช่น ปิดภาคเรียนพิเศษ" />
                {e.name && <div style={{ color: 'red' }}>{e.name}</div>}
              </>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <Label>หมายเหตุ</Label>
            <Textarea
              name="note"
              value={v.note}
              onChange={change}
              rows={3}
              placeholder="ไม่เกิน 200 ตัวอักษร"
            />
            {e.note && <div style={{ color: 'red' }}>{e.note}</div>}
          </div>
        </div>
      </form>
    </CommonModal>
  );
}