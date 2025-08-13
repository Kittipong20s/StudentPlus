// src/mocks/seed.js
import { db, uid } from './db';

export async function seedIfEmpty() {
  // โรงเรียน
  if (!db.get('school_info', null)) {
    db.set('school_info', {
      school_code: 'SCH001',
      school_name: 'โรงเรียนตัวอย่าง',
      address: '123/45 ถนนสุขุมวิท กทม.',
      phone: '021234567',
      education_level: 'ประถมศึกษา',
    });
  }

  // ครู
  if ((db.get('teachers', [])).length === 0) {
    db.set('teachers', [
      { id: uid(), teacher_code: 'T001', prefix: 'นาย', first_name: 'สมชาย', last_name: 'ใจดี', phone: '0891112222', email: 'somchai@example.com', position: 'ครูคณิต' },
      { id: uid(), teacher_code: 'T002', prefix: 'นางสาว', first_name: 'วราภรณ์', last_name: 'มีสุข', phone: '0893334444', email: 'waraporn@example.com', position: 'ครูวิทย์' },
    ]);
  }

  // นักเรียน
  if ((db.get('students', [])).length === 0) {
    db.set('students', [
      { id: uid(), national_id: '', student_id: 'S001', prefix: 'เด็กชาย', first_name: 'นที', last_name: 'สุขใจ', birth_date: '2013-05-10', grade: 'ประถมศึกษาปีที่ 5', room: '1', address: 'กทม.', phone: '0810001111', status: 'กำลังศึกษา' },
      { id: uid(), national_id: '', student_id: 'S002', prefix: 'เด็กหญิง', first_name: 'ขวัญข้าว', last_name: 'บุญมาก', birth_date: '2013-11-01', grade: 'ประถมศึกษาปีที่ 5', room: '1', address: 'กทม.', phone: '0810002222', status: 'กำลังศึกษา' },
    ]);
  }

  // ครูประจำชั้น / ปฏิทิน / รายงานลา / ประกาศ — เริ่มว่างไว้ก่อน
  if ((db.get('homerooms', [])).length === 0) db.set('homerooms', []);
  if ((db.get('calendar-items', [])).length === 0) db.set('calendar-items', []);
  if ((db.get('leave-records', [])).length === 0) db.set('leave-records', []);
  if ((db.get('announcements', [])).length === 0) db.set('announcements', []);
}