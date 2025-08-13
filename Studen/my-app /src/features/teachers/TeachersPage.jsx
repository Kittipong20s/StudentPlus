// src/features/teachers/TeachersPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Page from '../../components/ui/Page';
import Card from '../../components/ui/Card';
import { Button, Input } from '../../components/ui/Controls';
import CommonModal from '../../components/CommonModal';
import { toast } from '../../hooks/useToast';

import TeacherApi from './TeacherApi';
import TeacherTable from './TeacherTable';
import AddTeacherForm from './AddTeacherForm';
import ImportDialog from './ImportDialog';
import * as XLSX from 'xlsx';

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [q, setQ] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);    // null=ซ่อน, {}=เพิ่ม, item=แก้ไข
  const [preview, setPreview] = useState(null);    // ดูรายละเอียด
  const [confirmId, setConfirmId] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false); // ✅ Modal เลือกรูปแบบไฟล์

  const load = async () => setTeachers(await TeacherApi.list());
  useEffect(() => { load(); }, []);

  // ค้นหาแบบ AND
  const filtered = useMemo(() => {
    const safe = (v) => (v ?? '').toString().toLowerCase();
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return teachers;
    return teachers.filter(t => {
      const hay = [
        t.teacher_code, t.prefix, t.first_name, t.last_name, t.position, t.email, t.phone
      ].map(safe).join(' ');
      return terms.every(term => hay.includes(term));
    });
  }, [q, teachers]);

  const onCreate = async (payload) => {
    try {
      await TeacherApi.create(payload);
      toast({ title: 'สำเร็จ', message: 'บันทึกสำเร็จ', variant: 'success' });
      setShowForm(false); setEditing(null); await load();
    } catch (err) {
      if (err?.code === 'DUP_CODE') {
        toast({ title:'ซ้ำ', message:'รหัสคุณครูนี้มีอยู่แล้ว', variant:'error' });
      } else if (err?.code === 'DUP_EMAIL') {
        toast({ title:'ซ้ำ', message:'อีเมลนี้มีอยู่แล้ว', variant:'error' });
      } else {
        toast({ title:'ผิดพลาด', message:'บันทึกข้อมูลไม่สำเร็จ', variant:'error' });
      }
    }
  };

  const onUpdate = async (payload) => {
    try {
      await TeacherApi.update(editing.id, payload);
      toast({ title: 'สำเร็จ', message: 'อัปเดตสำเร็จ', variant: 'success' });
      setShowForm(false); setEditing(null); await load();
    } catch {
      toast({ title:'ผิดพลาด', message:'บันทึกข้อมูลไม่สำเร็จ', variant:'error' });
    }
  };

  const onDelete = async () => {
    try {
      await TeacherApi.remove(confirmId);
      toast({ title:'สำเร็จ', message:'ลบข้อมูลแล้ว', variant:'success' });
      setConfirmId(null); await load();
    } catch {
      toast({ title:'ผิดพลาด', message:'ลบไม่สำเร็จ', variant:'error' });
    }
  };

  const onImported = async (rows) => {
    for (const r of rows) await TeacherApi.create(r).catch(()=>{});
    toast({ title:'สำเร็จ', message:`นำเข้าแล้ว ${rows.length} รายการ`, variant:'success' });
    setShowImport(false); await load();
  };

  /** ---------- ดาวน์โหลดเทมเพลต ---------- **/
  const HEADERS = ['ID','Prefix','FirstName','LastName','Phone','Email','Role'];
  const SAMPLE_ROWS = [
    ['TR202500123','นาย','สมชาย','ใจดี','081-234-5678','somchai.j@example.com','ครูผู้สอน'],
    ['TR202500124','นางสาว','ศริมา','ทองดี','089 111-2222','sirima.t@example.com','ครูผู้ช่วย'],
  ];

  const downloadCSV = () => {
    const headerLine = HEADERS.join(',');
    const body = SAMPLE_ROWS.map(r =>
      r.map(v => {
        const val = v.toString().replace(/"/g, '""');
        return /[",\n]/.test(val) ? `"${val}"` : val;
      }).join(',')
    ).join('\n');

    const blob = new Blob([headerLine+'\n'+body], { type:'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'teacher_import_template.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    setShowTemplate(false);
  };

  const downloadXLSX = () => {
    const ws = XLSX.utils.aoa_to_sheet([HEADERS, ...SAMPLE_ROWS]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'teacher_import_template.xlsx');
    setShowTemplate(false);
  };

  return (
    <Page
      title="รายชื่อคุณครู"
      max={1280}
      actions={
        <>
          <Button type="button" onClick={() => setShowImport(true)}>นำเข้า</Button>
          <Button type="button" variant="secondary" onClick={() => setShowTemplate(true)}>
            ดาวน์โหลดเทมเพลต
          </Button>
          <Button type="button" onClick={() => { setEditing({}); setShowForm(true); }}>+ เพิ่มคุณครู</Button>
        </>
      }
    >
      <Card>
        <div style={{ display:'flex', gap:8, marginBottom:12, alignItems:'center' }}>
          <Input
            placeholder="ค้นหาด้วย รหัส, ชื่อ, ตำแหน่ง หรือ อีเมล"
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            style={{ flex:1 }}
          />
          <Button type="button" variant="secondary" onClick={()=>setQ('')}>ล้างค้นหา</Button>
        </div>

        <div className="table-container">
          <TeacherTable
            items={filtered}
            onView={(row)=>setPreview(row)}
            onEdit={(row)=>{ setEditing(row); setShowForm(true); }}
            onDelete={(id)=>setConfirmId(id)}
          />
        </div>
      </Card>

      {/* ฟอร์มเพิ่ม/แก้ไข */}
      {showForm && (
        <CommonModal
          open={showForm}
          title={editing?.id ? 'แก้ไขคุณครู' : 'เพิ่มคุณครู'}
          onClose={()=>{ setShowForm(false); setEditing(null); }}
          actions={<Button variant="secondary" onClick={()=>{ setShowForm(false); setEditing(null); }}>ปิด</Button>}
        >
          <AddTeacherForm
            initialValue={editing?.id ? editing : undefined}
            onSubmit={editing?.id ? onUpdate : onCreate}
            onCancel={()=>{ setShowForm(false); setEditing(null); }}
          />
        </CommonModal>
      )}

      {/* ดูรายละเอียด */}
      {preview && (
        <CommonModal
          open
          title="ข้อมูลคุณครู"
          onClose={()=>setPreview(null)}
          actions={<Button onClick={()=>setPreview(null)}>ปิด</Button>}
        >
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:8 }}>
            <div>รหัส</div><div>{preview.teacher_code || '-'}</div>
            <div>คำนำหน้า</div><div>{preview.prefix || '-'}</div>
            <div>ชื่อ</div><div>{preview.first_name || '-'}</div>
            <div>นามสกุล</div><div>{preview.last_name || '-'}</div>
            <div>เบอร์โทร</div><div>{preview.phone || '-'}</div>
            <div>อีเมล</div><div>{preview.email || '-'}</div>
            <div>ตำแหน่ง</div><div>{preview.position || '-'}</div>
          </div>
        </CommonModal>
      )}

      {/* ยืนยันลบ */}
      <CommonModal
        open={!!confirmId}
        title="ยืนยันลบข้อมูล?"
        onClose={()=>setConfirmId(null)}
        actions={
          <>
            <Button variant="secondary" onClick={()=>setConfirmId(null)}>ยกเลิก</Button>
            <Button variant="danger" onClick={onDelete}>ลบ</Button>
          </>
        }
      >
        ต้องการลบคุณครูนี้ใช่หรือไม่
      </CommonModal>

      {/* นำเข้า */}
      {showImport && (
        <ImportDialog
          onClose={()=>setShowImport(false)}
          onImported={onImported}
        />
      )}

      {/* ✅ Modal เลือกรูปแบบไฟล์เทมเพลต */}
      <CommonModal
        open={showTemplate}
        title="ดาวน์โหลดเทมเพลตนำเข้าคุณครู"
        onClose={()=>setShowTemplate(false)}
        actions={<Button variant="secondary" onClick={()=>setShowTemplate(false)}>ปิด</Button>}
      >
        <div style={{ display:'grid', gap:12 }}>
          <div>เลือกรูปแบบไฟล์ที่ต้องการดาวน์โหลด:</div>
          <div style={{ display:'flex', gap:8 }}>
            <Button onClick={downloadCSV}>ดาวน์โหลดเป็น .csv</Button>
            <Button onClick={downloadXLSX}>ดาวน์โหลดเป็น .xlsx</Button>
          </div>
        </div>
      </CommonModal>
    </Page>
  );
}