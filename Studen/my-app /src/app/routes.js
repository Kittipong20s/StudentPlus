// src/app/routes.js
export const ROUTES = {
  SCHOOL: '/school',
  TEACHERS: '/teachers',
  STUDENTS: '/students',
  HOMEROOM: '/homeroom',
  CALENDAR: '/calendar',
  MOVE_STUDENTS: '/move-students',
  LEAVE_REPORT: '/leave-report',
  ANNOUNCEMENTS: '/announcements',
};

export const NAV_ITEMS = [
  { path: ROUTES.SCHOOL, label: 'เพิ่มโรงเรียน' },
  { path: ROUTES.TEACHERS, label: 'รายชื่อคุณครู' },
  { path: ROUTES.STUDENTS, label: 'นักเรียน' },
  { path: ROUTES.HOMEROOM, label: 'กำหนดครูประจำชั้น' },
  { path: ROUTES.CALENDAR, label: 'ปฏิทินการศึกษา' },
  { path: ROUTES.MOVE_STUDENTS, label: 'ย้ายนักเรียน' }, // << เพิ่มเมนูนี้
  { path: ROUTES.LEAVE_REPORT, label: 'รายงานการลา' },
  { path: ROUTES.ANNOUNCEMENTS, label: 'ประกาศ' },
];