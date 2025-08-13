import React, { useEffect, useState } from 'react';
import CommonModal from '../../components/CommonModal';
import { Label, Input, Select, Textarea, Button } from '../../components/ui/Controls';
import CalendarApi from './CalendarApi';
import { toast } from '../../hooks/useToast';

// ===== ค่าคงที่ (นอกคอมโพเนนต์) =====
const EVENT_TITLES = ['งานกีฬาสี', 'สอบกลางภาค', 'สอบปลายภาค', 'อื่นๆ'];
const EVENT_DEFAULT = {
  type: 'event',
  title: '',
  date: '',
  start_time: '',
  end_time: '',
  note: '',
};

export default function EventForm({ open, onClose, onSaved, initialValue }) {
  const isEdit = !!initialValue?.id;

  const [v, setV] = useState(initialValue || EVENT_DEFAULT);
  const [e, setE] = useState({});

  useEffect(() => {
    setV(initialValue || EVENT_DEFAULT);
    setE({});
  }, [initialValue, open]);

  const change = (ev) => setV((s) => ({ ...s, [ev.target.name]: ev.target.value }));

  const validate = () => {
    const errs = {};
    if (!v.date) errs.date = 'กรุณาเลือกวันที่จัดกิจกรรม';
    if (!v.title || !String(v.title).trim()) errs.title = 'กรุณาเลือก/กรอกชื่อกิจกรรม';
    if (v.note && v.note.length > 200) errs.note = 'หมายเหตุไม่เกิน 200 ตัวอักษร';
    if (v.start_time && v.end_time && v.end_time <= v.start_time) {
      errs.end_time = 'เวลาเลิกกิจกรรมต้องมากกว่าเวลาเริ่ม';
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

  const selectValue = EVENT_TITLES.includes(v.title)
    ? v.title
    : (v.title ? 'อื่นๆ' : '');

  return (
    <CommonModal
      open={open}
      title={isEdit ? 'แก้ไขกิจกรรม' : 'เพิ่มกิจกรรม'}
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
            <Label>วันที่จัดกิจกรรม</Label>
            <Input type="date" name="date" value={v.date} onChange={change} />
            {e.date && <div style={{ color: 'red' }}>{e.date}</div>}
          </div>

          <div>
            <Label>เวลาเริ่มกิจกรรม</Label>
            <Input type="time" name="start_time" value={v.start_time} onChange={change} />
          </div>

          <div>
            <Label>เวลาเลิกกิจกรรม</Label>
            <Input type="time" name="end_time" value={v.end_time} onChange={change} />
            {e.end_time && <div style={{ color: 'red' }}>{e.end_time}</div>}
          </div>

          <div>
            <Label>ชื่อกิจกรรม</Label>
            <Select
              value={selectValue}
              onChange={(e) => {
                const val = e.target.value;
                setV((s) => ({ ...s, title: val === 'อื่นๆ' ? '' : val }));
              }}
            >
              <option value="">— เลือก —</option>
              {EVENT_TITLES.map((t) => <option key={t} value={t}>{t}</option>)}
            </Select>
            {/* ช่องกรอกเองเมื่อเลือก "อื่นๆ" หรือยังไม่มีค่า */}
            {(!EVENT_TITLES.includes(v.title) || v.title === '') && (
              <>
                <Label style={{ marginTop: 8 }}>กิจกรรม (กรณีอื่นๆ)</Label>
                <Input name="title" value={v.title} onChange={change} placeholder="เช่น ประชุมผู้ปกครอง" />
                {e.title && <div style={{ color: 'red' }}>{e.title}</div>}
              </>
            )}
          </div>

          <div style={{ gridColumn: '1 / -1' }}>
            <Label>หมายเหตุเพิ่มเติม</Label>
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