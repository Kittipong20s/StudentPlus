// src/features/homeroom/HomeroomAssignPage.jsx
import React, { useEffect, useState } from 'react';
import Page from '../../components/ui/Page';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Controls';
import CommonModal from '../../components/CommonModal';

import HomeroomApi from './HomeroomApi';
import TeacherApi from '../teachers/TeacherApi';
import HomeroomForm from './HomeroomForm';
import HomeroomTable from './HomeroomTable';
import { toast } from '../../hooks/useToast';

export default function HomeroomAssignPage() {
  const [rows, setRows] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [editing, setEditing] = useState(null);     // {} = create, item = edit
  const [preview, setPreview] = useState(null);     // read-only modal
  const [confirmId, setConfirmId] = useState(null); // id to delete

  const load = async () => {
    const data = await HomeroomApi.list();             // [{ id, academic_year, ..., teacher_id }]
    const ts = await TeacherApi.list();                // [{ id, prefix, first_name, last_name, ... }]
    const safeTeachers = Array.isArray(ts) ? ts : [];
    const tMap = Object.fromEntries(
      safeTeachers.map((t) => [
        String(t.id),
        `${t.prefix || ''} ${t.first_name || ''} ${t.last_name || ''}`.trim()
      ])
    );

    setTeachers(safeTeachers);
    setRows(
      (Array.isArray(data) ? data : []).map((r) => ({
        ...r,
        teacher_name: r.teacher_name || tMap[String(r.teacher_id)] || '-',
      }))
    );
  };

  useEffect(() => { load(); }, []);

  const create = async (payload) => {
    try {
      await HomeroomApi.create(payload);
      toast({ title: 'สำเร็จ', message: 'บันทึกสำเร็จ', variant: 'success' });
      setEditing(null);
      await load();
    } catch {
      toast({ title: 'ผิดพลาด', message: 'บันทึกข้อมูลไม่สำเร็จ', variant: 'error' });
    }
  };

  const update = async (payload) => {
    try {
      await HomeroomApi.update(editing.id, payload);
      toast({ title: 'สำเร็จ', message: 'อัปเดตสำเร็จ', variant: 'success' });
      setEditing(null);
      await load();
    } catch {
      toast({ title: 'ผิดพลาด', message: 'บันทึกข้อมูลไม่สำเร็จ', variant: 'error' });
    }
  };

  const remove = async () => {
    try {
      await HomeroomApi.remove(confirmId);
      toast({ title: 'สำเร็จ', message: 'ลบข้อมูลแล้ว', variant: 'success' });
      setConfirmId(null);
      await load();
    } catch {
      toast({ title: 'ผิดพลาด', message: 'ลบไม่สำเร็จ', variant: 'error' });
    }
  };

  return (
    <Page
      title="กำหนดครูประจำชั้น"
      max={1280}
      actions={
        <Button type="button" onClick={() => setEditing({})}>
          + เพิ่มการกำหนด
        </Button>
      }
    >
      {/* ฟอร์มเพิ่ม/แก้ไข */}
      {editing && (
        <Card style={{ marginBottom: 12 }}>
          <h3 style={{ marginTop: 0 }}>{editing.id ? 'แก้ไข' : 'เพิ่ม'}</h3>
          <HomeroomForm
            initialValue={editing.id ? editing : undefined}
            existing={rows}
            teachers={teachers}
            onSubmit={editing.id ? update : create}
            onCancel={() => setEditing(null)}
          />
        </Card>
      )}

      {/* ตาราง */}
      <Card>
        <HomeroomTable
          items={rows}
          onView={(r) => setPreview(r)}
          onEdit={(r) => setEditing(r)}
          onDelete={(id) => setConfirmId(id)}
        />
      </Card>

      {/* ดูข้อมูล (read-only) */}
      {preview && (
        <CommonModal
          open
          title="รายละเอียดการกำหนดครูประจำชั้น"
          onClose={() => setPreview(null)}
          actions={<Button type="button" onClick={() => setPreview(null)}>ปิด</Button>}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 8 }}>
            <div>ปีการศึกษา</div><div>{preview.academic_year || '-'}</div>
            <div>ระดับการศึกษา</div><div>{preview.education_stage || '-'}</div>
            <div>ระดับชั้น</div><div>{preview.grade || '-'}</div>
            <div>ห้องเรียน</div><div>{preview.room || '-'}</div>
            <div>ตำแหน่ง</div><div>{preview.position || '-'}</div>
            <div>ครูประจำชั้น</div><div>{preview.teacher_name || '-'}</div>
          </div>
        </CommonModal>
      )}

      {/* ยืนยันลบ */}
      <CommonModal
        open={!!confirmId}
        title="ยืนยันลบรายการ?"
        onClose={() => setConfirmId(null)}
        actions={
          <>
            <Button type="button" variant="secondary" onClick={() => setConfirmId(null)}>
              ยกเลิก
            </Button>
            <Button type="button" variant="danger" onClick={remove}>
              ยืนยัน
            </Button>
          </>
        }
      >
        ต้องการลบรายการนี้ใช่หรือไม่
      </CommonModal>
    </Page>
  );
}