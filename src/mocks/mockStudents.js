// src/mocks/mockStudents.js
export const mockStudents = [
  {
    id: 's_001',
    national_id: '1103700000011',
    student_id: 'STU001',
    prefix: 'เด็กชาย',
    first_name: 'สมชาย',
    last_name: 'มั่นคง',
    birth_date: '2014-05-10',
    education_stage: 'ประถมศึกษา',
    grade: 'ประถม 1',
    room: '1',
    address: '12/3 หมู่ 1 ต.ตัวอย่าง อ.ตัวอย่าง',
    phone: '0812345678',
    status: 'กำลังศึกษา',
    createdAt: Date.now()
  },
  {
    id: 's_002',
    national_id: '1103700000029',
    student_id: 'STU002',
    prefix: 'เด็กหญิง',
    first_name: 'สมนึก',
    last_name: 'สุขใจ',
    birth_date: '2014-09-22',
    education_stage: 'ประถมศึกษา',
    grade: 'ประถม 1',
    room: '1',
    address: '45/6 หมู่ 2',
    phone: '0897654321',
    status: 'กำลังศึกษา',
    createdAt: Date.now()
  },
  {
    id: 's_003',
    national_id: '1103700000037',
    student_id: 'STU003',
    prefix: 'เด็กหญิง',
    first_name: 'นุ่น',
    last_name: 'นวลจันทร์',
    birth_date: '2013-02-14',
    education_stage: 'ประถมศึกษา',
    grade: 'ประถม 2',
    room: '2',
    address: '99 หมู่ 9',
    phone: '0800000000',
    status: 'กำลังศึกษา',
    createdAt: Date.now()
  }
];

export default mockStudents;