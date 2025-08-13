// src/mocks/mockTeachers.js
export const mockTeachers = [
  {
    id: 't_001',
    teacher_code: 'T001',
    prefix: 'นาย',
    first_name: 'วิชัย',
    last_name: 'ใจดี',
    phone: '081-111-1111',
    email: 'wichai@example.com',
    position: 'ครูผู้สอน',
    createdAt: Date.now()
  },
  {
    id: 't_002',
    teacher_code: 'T002',
    prefix: 'นาง',
    first_name: 'สุดา',
    last_name: 'ศรีงาม',
    phone: '081-222-2222',
    email: 'suda@example.com',
    position: 'ครูผู้สอน',
    createdAt: Date.now()
  },
  {
    id: 't_003',
    teacher_code: 'T003',
    prefix: 'นางสาว',
    first_name: 'กมล',
    last_name: 'วรรณศิลป์',
    phone: '081-333-3333',
    email: 'kamon@example.com',
    position: 'ครูผู้สอน',
    createdAt: Date.now()
  }
];

export default mockTeachers;