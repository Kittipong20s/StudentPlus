// src/features/students/StudentsPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import Page from '../../components/ui/Page';
import Card from '../../components/ui/Card';
import { Button, Input } from '../../components/ui/Controls';
import { toast } from '../../hooks/useToast';
import StudentApi from './StudentApi';
import StudentForm from './AddStudentForm';
import StudentTable from './StudentTable';
import ImportStudentsDialog from './ImportStudentsDialog';
import CommonModal from '../../components/CommonModal';
import * as XLSX from 'xlsx';

export default function StudentsPage() {
  const [rows, setRows] = useState([]);
  const [editing, setEditing] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [showTemplate, setShowTemplate] = useState(false); // ✅ state modal template
  const [q, setQ] = useState('');

  const load = async () => setRows(await StudentApi.list());
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const terms = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return rows;
    return rows.filter(r => {
      const hay = [
        r.national_id, r.student_id, r.prefix, r.first_name, r.last_name,
        r.grade, r.room, r.status
      ].join(' ').toLowerCase();
      return terms.every(t => hay.includes(t));
    });
  }, [q, rows]);

  const create = async (payload) => {
    try {
      await StudentApi.create(payload);
      toast({ title:'สำเร็จ', message:'บันทึกสำเร็จ', variant:'success' });
      setEditing(null); await load();
    } catch (err) {
      console.error(err);
      toast({ title:'ผิดพลาด', message:'บันทึกข้อมูลไม่สำเร็จ', variant:'error' });
    }
  };
  const update = async (payload) => {
    try {
      await StudentApi.update(editing.id, payload);
      toast({ title:'สำเร็จ', message:'บันทึกสำเร็จ', variant:'success' });
      setEditing(null); await load();
    } catch (err) {
      console.error(err);
      toast({ title:'ผิดพลาด', message:'บันทึกข้อมูลไม่สำเร็จ', variant:'error' });
    }
  };
  const remove = async (id) => {
    if (!confirm('ยืนยันลบข้อมูล?')) return;
    try {
      await StudentApi.remove(id);
      toast({ title:'สำเร็จ', message:'ลบข้อมูลแล้ว', variant:'success' });
      await load();
    } catch (err) {
      console.error(err);
      toast({ title:'ผิดพลาด', message:'ลบไม่สำเร็จ', variant:'error' });
    }
  };

  // ✅ ข้อมูล header + sample
  const HEADERS = [
    'NationalId','StudentId','Prefix','FirstName','LastName','BirthDate',
    'EducationStage','Grade','Room','Address','Phone','Status'
  ];
  const SAMPLE_ROWS = [
    ['1234567890123','STU001','เด็กชาย','สมชาย','มั่นคง','2010-05-15','ประถมศึกษา','ประถม 1','1','123/45 หมู่ 5 ต.ทดสอบ','0812345678','กำลังศึกษา'],
    ['2345678901234','STU002','เด็กหญิง','สวยงาม','ทองดี','2011-07-20','ประถมศึกษา','ประถม 4','2','99/1 ถนนหลัก เขตเมือง','0898765432','กำลังศึกษา'],
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
    a.download = 'student_import_template.csv';
    a.click();
    URL.revokeObjectURL(a.href);
    setShowTemplate(false);
  };

  const downloadXLSX = () => {
    const wsData = [HEADERS, ...SAMPLE_ROWS];
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template');
    XLSX.writeFile(wb, 'student_import_template.xlsx');
    setShowTemplate(false);
  };

  return (
    <Page
      title="รายชื่อนักเรียน"
      max={1280}
      actions={
        <>
          <Button type="button" onClick={()=>setShowImport(true)}>นำเข้า</Button>
          <Button type="button" variant="secondary" onClick={()=>setShowTemplate(true)}>
            ดาวน์โหลดเทมเพลต
          </Button>
          <Button type="button" onClick={()=>setEditing({})}>+ เพิ่มนักเรียน</Button>
        </>
      }
    >
      <Card>
        <div style={{ display:'flex', gap:8, marginBottom:12, alignItems:'center' }}>
          <Input
            placeholder="ค้นหา..."
            value={q}
            onChange={(e)=>setQ(e.target.value)}
            style={{ flex:1 }}
          />
          <Button type="button" variant="secondary" onClick={()=>setQ('')}>ล้างค้นหา</Button>
        </div>

        {editing && (
          <div className="card" style={{ marginBottom:12 }}>
            <h3>{editing.id ? 'แก้ไขนักเรียน' : (editing.readonly ? 'ดูข้อมูลนักเรียน' : 'เพิ่มนักเรียน')}</h3>
            {editing.readonly ? (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:8 }}>
                {[
                  ['เลขบัตรประชาชน','national_id'],
                  ['รหัสนักเรียน','student_id'],
                  ['คำนำหน้า','prefix'],
                  ['ชื่อ','first_name'],
                  ['นามสกุล','last_name'],
                  ['วันเกิด','birth_date'],
                  ['ระดับการศึกษา','education_stage'],
                  ['ระดับชั้น','grade'],
                  ['ห้อง','room'],
                  ['ที่อยู่','address'],
                  ['เบอร์โทร','phone'],
                  ['สถานะ','status'],
                ].map(([label,key])=>(
                  <React.Fragment key={key}>
                    <div>{label}</div>
                    <div style={{ whiteSpace:key==='address'?'pre-wrap':'normal' }}>{editing[key]}</div>
                  </React.Fragment>
                ))}
                <div style={{ gridColumn:'1 / -1', marginTop:8 }}>
                  <Button variant="secondary" onClick={()=>setEditing(null)}>ปิด</Button>
                </div>
              </div>
            ) : (
              <StudentForm
                initialValue={editing.id ? editing : undefined}
                onSaved={editing.id ? update : create}
                onCancel={()=>setEditing(null)}
              />
            )}
          </div>
        )}

        <div className="table-container">
          <StudentTable
            data={filtered}
            dense
            onView={(row)=>setEditing({ ...row, readonly:true })}
            onEdit={(row)=>setEditing(row)}
            onDelete={remove}
          />
        </div>
      </Card>

      {showImport && (
        <ImportStudentsDialog
          open={showImport}
          onClose={()=>setShowImport(false)}
          onImported={async (list)=>{
            try {
              for (const r of list) await StudentApi.create(r);
              toast({ title:'สำเร็จ', message:`นำเข้าแล้ว ${list.length} รายการ`, variant:'success' });
              setShowImport(false); await load();
            } catch (err) {
              console.error(err);
              toast({ title:'ผิดพลาด', message:'นำเข้าไม่สำเร็จ', variant:'error' });
            }
          }}
        />
      )}

      {/* ✅ Modal เลือกรูปแบบไฟล์ */}
      <CommonModal
        open={showTemplate}
        title="ดาวน์โหลดเทมเพลตนำเข้านักเรียน"
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