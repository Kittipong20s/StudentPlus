// src/mocks/mockHomeroom.js
export const mockHomeroom = [
  {
    id: 'hm_001',
    academic_year: String(new Date().getFullYear() + 543),
    education_stage: 'ประถมศึกษา',
    grade: 'ประถม 1',
    room: '1',
    position: 'ครูประจำชั้นหลัก',
    teacher_id: 't_001',
    createdAt: Date.now()
  },
  {
    id: 'hm_002',
    academic_year: String(new Date().getFullYear() + 543),
    education_stage: 'ประถมศึกษา',
    grade: 'ประถม 1',
    room: '1',
    position: 'ครูประจำชั้นรอง',
    teacher_id: 't_002',
    createdAt: Date.now()
  }
];

export default mockHomeroom;