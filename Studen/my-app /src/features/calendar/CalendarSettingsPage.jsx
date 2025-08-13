import React, { useEffect, useState } from 'react';
import Page from '../../components/ui/Page';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Controls';
import CalendarApi from './CalendarApi';
import CalendarList from './CalendarList';

import NormalDayForm from './NormalDayForm';
import HolidayForm from './HolidayForm';
import EventForm from './EventForm';
import CommonModal from '../../components/CommonModal';
import { toast } from '../../hooks/useToast';

export default function CalendarSettingsPage() {
  const [items, setItems] = useState([]);
  const [showNormal, setShowNormal] = useState(false);
  const [showHoliday, setShowHoliday] = useState(false);
  const [showEvent, setShowEvent] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [viewItem, setViewItem] = useState(null); // ✅ เก็บรายการที่กดดู

  const load = async () => setItems(await CalendarApi.list());
  useEffect(() => { load(); }, []);

  const onDelete = async () => {
    try {
      await CalendarApi.remove(confirmId);
      toast({ title:'สำเร็จ', message:'ลบสำเร็จ', variant:'success' });
      setConfirmId(null);
      await load();
    } catch {
      toast({ title:'ผิดพลาด', message:'ลบไม่สำเร็จ', variant:'error' });
    }
  };

  // แสดงรายละเอียดแบบ read-only ตามชนิด
  const renderViewDetail = (it) => {
    if (!it) return null;
    const rows = [];
    if (it.type === 'normal') {
      rows.push(['ประเภท', 'วันปกติ']);
      rows.push(['ภาคการศึกษา', it.semester || '-']);
      rows.push(['ปีการศึกษา', it.academic_year || '-']);
      rows.push(['วันเปิดภาคเรียน', it.open_date || '-']);
      rows.push(['วันปิดภาคเรียน', it.close_date || '-']);
      rows.push(['เวลาเข้าเรียน', it.time_in || '--:--']);
      rows.push(['เวลาเลิกเรียน', it.time_out || '--:--']);
      rows.push(['หมายเหตุ', it.note || '-']);
    } else if (it.type === 'holiday') {
      rows.push(['ประเภท', 'วันหยุด']);
      rows.push(['ชื่อวันหยุด', it.name || '-']);
      rows.push(['วันที่เริ่มต้น', it.start_date || '-']);
      rows.push(['วันที่สิ้นสุด', it.end_date || '(วันเดียว)']);
      rows.push(['หมายเหตุ', it.note || '-']);
    } else if (it.type === 'event') {
      rows.push(['ประเภท', 'กิจกรรมพิเศษ']);
      rows.push(['ชื่อกิจกรรม', it.title || '-']);
      rows.push(['วันที่จัดกิจกรรม', it.date || '-']);
      rows.push(['เวลาเริ่มกิจกรรม', it.start_time || '--:--']);
      rows.push(['เวลาเลิกกิจกรรม', it.end_time || '--:--']);
      rows.push(['หมายเหตุเพิ่มเติม', it.note || '-']);
    } else {
      rows.push(['ประเภท', it.type || '-']);
    }

    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
        {rows.map(([k, v], idx) => (
          <React.Fragment key={idx}>
            <div>{k}</div>
            <div>{v}</div>
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <Page
      title="ปฏิทินการศึกษา"
      actions={
        <>
          <Button onClick={() => setShowNormal(true)}>ตั้งค่าเวลาเข้า–ออก</Button>
          <Button onClick={() => setShowHoliday(true)}>ตั้งค่าวันหยุด</Button>
          <Button onClick={() => setShowEvent(true)}>ตั้งค่ากิจกรรม</Button>
        </>
      }
    >
      <Card>
        <CalendarList
          items={items}
          onView={(it) => setViewItem(it)}                    // ✅ ส่ง handler ดูข้อมูล
          onEdit={() => toast({ message:'(เดโม) ยังไม่เปิดแก้ไข — ลบแล้วเพิ่มใหม่แทนได้', variant:'success' })}
          onDelete={(id) => setConfirmId(id)}
        />
      </Card>

      {/* ฟอร์มเพิ่มแต่ละชนิด (Modal) */}
      <NormalDayForm open={showNormal} onClose={() => setShowNormal(false)} onAdded={load} />
      <HolidayForm open={showHoliday} onClose={() => setShowHoliday(false)} onAdded={load} />
      <EventForm  open={showEvent}  onClose={() => setShowEvent(false)}  onAdded={load} />

      {/* ยืนยันลบ */}
      <CommonModal
        open={!!confirmId}
        title="ยืนยันลบรายการ?"
        onClose={() => setConfirmId(null)}
        actions={<>
          <Button variant="secondary" onClick={() => setConfirmId(null)}>ยกเลิก</Button>
          <Button variant="danger" onClick={onDelete}>ยืนยัน</Button>
        </>}
      >
        ต้องการลบรายการนี้ใช่หรือไม่
      </CommonModal>

      {/* ✅ Modal ดูข้อมูล */}
      <CommonModal
        open={!!viewItem}
        title="รายละเอียด"
        onClose={() => setViewItem(null)}
        actions={<Button variant="secondary" onClick={() => setViewItem(null)}>ปิด</Button>}
      >
        {renderViewDetail(viewItem)}
      </CommonModal>
    </Page>
  );
}