// src/features/school/AddSchoolPage.jsx
import React, { useEffect, useState } from 'react';
import Page from '../../components/ui/Page';
import Card from '../../components/ui/Card';
import { Button } from '../../components/ui/Controls';
import AddSchoolForm from './AddSchoolForm';
import schoolDataApi from './schoolDataApi';
import { toast } from '../../hooks/useToast';

export default function AddSchoolPage() {
  const [school, setSchool] = useState(null);
  const [editing, setEditing] = useState(false);

  const load = async () => setSchool(await schoolDataApi.get());
  useEffect(() => { load(); }, []);

  const create = async (payload) => {
    try {
      await schoolDataApi.create(payload);
      toast({ title: 'สำเร็จ', message: 'บันทึกสำเร็จ', variant: 'success' });
      setEditing(false);
      await load();
    } catch (err) {
      if (err?.code === 'EXISTS') {
        toast({ title: 'ซ้ำ', message: 'มีโรงเรียนอยู่แล้ว ไม่สามารถเพิ่มซ้ำ', variant: 'error' });
      } else {
        toast({ title: 'ผิดพลาด', message: 'บันทึกข้อมูลไม่สำเร็จ', variant: 'error' });
      }
    }
  };

  const update = async (payload) => {
    try {
      await schoolDataApi.update(payload);
      toast({ title: 'สำเร็จ', message: 'อัปเดตสำเร็จ', variant: 'success' });
      setEditing(false);
      await load();
    } catch {
      toast({ title: 'ผิดพลาด', message: 'บันทึกข้อมูลไม่สำเร็จ', variant: 'error' });
    }
  };

  return (
    <Page title="เพิ่มโรงเรียน">
      {!school && !editing && (
        <Card style={{ maxWidth: 520 }}>
          <AddSchoolForm onSaved={create} onCancel={() => {}} />
        </Card>
      )}

      {school && !editing && (
        <Card style={{ maxWidth: 520 }}>
          <h3 style={{marginTop:0}}>โรงเรียนของฉัน</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:8 }}>
            <div>รหัสโรงเรียน</div><div>{school.school_code}</div>
            <div>ชื่อโรงเรียน</div><div>{school.school_name}</div>
            <div>ที่อยู่</div><div style={{ whiteSpace:'pre-wrap' }}>{school.address}</div>
            <div>เบอร์โทรศัพท์</div><div>{school.phone}</div>
            <div>ระดับการสอน</div><div>{school.education_level}</div>
          </div>
          <div style={{ marginTop: 12 }}>
            <Button onClick={() => setEditing(true)}>แก้ไขข้อมูลโรงเรียน</Button>
          </div>
        </Card>
      )}

      {school && editing && (
        <Card style={{ maxWidth: 520 }}>
          <AddSchoolForm initialValue={school} onSaved={update} onCancel={() => setEditing(false)} />
        </Card>
      )}
    </Page>
  );
}