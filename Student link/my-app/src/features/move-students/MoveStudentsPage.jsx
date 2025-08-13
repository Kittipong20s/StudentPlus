import React, { useEffect, useState } from 'react';
import Page from '../../components/ui/Page';
import Card from '../../components/ui/Card';
import { toast } from '../../hooks/useToast';
import MoveApi from './movestudentsApi';
import MoveStudentsForm from './MoveStudentsForm';
import MoveStudentsTable from './StudentSearchTable'; // <- ชื่อไฟล์นี้ต้องมีจริง
import CommonModal from '../../components/CommonModal';
import { Button } from '../../components/ui/Controls';

export default function MoveStudentsPage() {
  const [history, setHistory] = useState([]);
  const [confirmId, setConfirmId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(null);

  const load = async () => setHistory(await MoveApi.list());
  useEffect(() => { load(); }, []);

  const onMoved = async (payload) => {
    try {
      await MoveApi.create(payload);
      toast({ title:'สำเร็จ', message:'ย้ายห้องเรียบร้อย', variant:'success' });
      await load();
    } catch (err) {
      console.error(err);
      toast({ title:'ผิดพลาด', message:'ย้ายห้องไม่สำเร็จ', variant:'error' });
    }
  };

  const onUpdate = async (payload) => {
    try {
      await MoveApi.update(editing.id, payload);
      toast({ title:'สำเร็จ', message:'อัปเดตสำเร็จ', variant:'success' });
      setEditing(null);
      await load();
    } catch (err) {
      console.error(err);
      toast({ title:'ผิดพลาด', message:'อัปเดตไม่สำเร็จ', variant:'error' });
    }
  };

  const onDelete = async () => {
    try {
      await MoveApi.remove(confirmId);
      toast({ title:'สำเร็จ', message:'ลบรายการแล้ว', variant:'success' });
      setConfirmId(null);
      await load();
    } catch (err) {
      console.error(err);
      toast({ title:'ผิดพลาด', message:'ลบไม่สำเร็จ', variant:'error' });
    }
  };

  return (
    <Page title="ย้ายนักเรียนระหว่างห้อง" max={1280}>
      <Card style={{ marginBottom: 12 }}>
        <MoveStudentsForm onMoved={onMoved} />
      </Card>

      <Card>
        <h3 style={{ marginTop: 0 }}>ประวัติการย้าย</h3>
        <MoveStudentsTable
          data={history}
          onView={(row) => setPreview(row)}
          onEdit={(row) => setEditing(row)}
          onDelete={(id) => setConfirmId(id)}
        />
      </Card>

      {/* ดูรายละเอียด */}
      {preview && (
        <CommonModal open title="รายละเอียดการย้าย" onClose={() => setPreview(null)}
          actions={<Button onClick={() => setPreview(null)}>ปิด</Button>}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:8 }}>
            <div>วันที่ย้าย</div><div>{preview.moveDate || '-'}</div>
            <div>เดิม</div><div>{preview.fromDisplay || '-'}</div>
            <div>ใหม่</div><div>{preview.toDisplay || '-'}</div>
            <div>จำนวน</div><div>{preview.count ?? (preview.students?.length || 0)}</div>
            <div>หมายเหตุ</div><div>{preview.note || '-'}</div>
          </div>
        </CommonModal>
      )}

      {/* แก้ไข */}
      {editing && (
        <CommonModal open title="แก้ไขข้อมูลการย้าย" onClose={() => setEditing(null)}
          actions={<Button variant="secondary" onClick={() => setEditing(null)}>ยกเลิก</Button>}>
          <MoveStudentsForm
            initialValue={editing}
            mode="edit"
            onMoved={onUpdate}
            onCancel={() => setEditing(null)}
          />
        </CommonModal>
      )}

      {/* ลบ */}
      <CommonModal open={!!confirmId} title="ยืนยันลบรายการ?" onClose={() => setConfirmId(null)}
        actions={<>
          <Button variant="secondary" onClick={() => setConfirmId(null)}>ยกเลิก</Button>
          <Button variant="danger" onClick={onDelete}>ยืนยัน</Button>
        </>}>
        ต้องการลบรายการนี้ใช่หรือไม่
      </CommonModal>
    </Page>
  );
}