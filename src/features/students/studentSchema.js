// src/features/students/studentSchema.js

export const PREFIXES = ['เด็กชาย', 'เด็กหญิง', 'นาย', 'นาง', 'นางสาว'];
export const EDUCATION_STAGES = ['อนุบาลศึกษา', 'ประถมศึกษา', 'มัธยมศึกษา'];
export const STATUS_OPTIONS = ['กำลังศึกษา', 'พักการเรียน', 'ย้ายห้องเรียน', 'จบการศึกษา'];

export const GRADE_OPTIONS = {
  'อนุบาลศึกษา': ['อนุบาล 1', 'อนุบาล 2', 'อนุบาล 3'],
  'ประถมศึกษา': ['ประถม 1', 'ประถม 2', 'ประถม 3', 'ประถม 4', 'ประถม 5', 'ประถม 6'],
  'มัธยมศึกษา': ['มัธยม 1', 'มัธยม 2', 'มัธยม 3', 'มัธยม 4', 'มัธยม 5', 'มัธยม 6'],
};

export function getSchoolEducationStage() {
  try {
    const raw = localStorage.getItem('school_preview') || localStorage.getItem('school_info');
    const school = raw ? JSON.parse(raw) : null;
    return (school?.education_level && EDUCATION_STAGES.includes(school.education_level))
      ? school.education_level : '';
  } catch { return ''; }
}

const ZWSP = /\u200B/g;
function clean(s) { return String(s ?? '').replace(ZWSP, '').replace(/\s+/g, ' ').trim(); }

export function normalizeStatus(raw) {
  const s = clean(raw);
  const alias = {
    'กำลังเรียน': 'กำลังศึกษา',
    'กำลัง ศึกษา': 'กำลังศึกษา',
    'พัก เรียน': 'พักการเรียน',
    'ย้ายห้อง': 'ย้ายห้องเรียน',
    'จบ': 'จบการศึกษา',
  };
  return alias[s] || s;
}

export function normalizeStudentRow(row) {
  const r = { ...row };
  r.national_id = clean(r.national_id);
  r.student_id  = clean(r.student_id);
  r.prefix      = clean(r.prefix);
  r.first_name  = clean(r.first_name);
  r.last_name   = clean(r.last_name);
  r.birth_date  = clean(r.birth_date);
  r.education_stage = clean(r.education_stage);
  r.grade       = clean(r.grade);
  r.room        = clean(r.room);
  r.address     = String(r.address ?? '').replace(ZWSP, '').trim();
  r.phone       = clean(r.phone);
  r.status      = normalizeStatus(r.status);
  return r;
}

// ---------- REGEX ----------
const re = {
  nationalId: /^\d{1,13}$/,
  studentId : /^[A-Za-z0-9]{1,10}$/,
  thaiName  : /^[\u0E00-\u0E7F\s]{1,50}$/,
  // อนุญาตอักษรไทย/ตัวเลข/ช่องว่าง/จุด/จุลภาค/ทับ/ขีด ยาวได้ 1–200 ตัว
  address   : new RegExp('^[\\u0E00-\\u0E7F0-9\\s.,/ -]{1,200}$'),
  phone     : /^[0-9 -]{1,10}$/,
  room      : /^\d{1,5}$/,
};

const MSG = {
  national_id: 'กรุณากรอก เลขประจำตัวประชาชน ให้ถูกต้องและครบถ้วน',
  student_id : 'กรุณากรอก รหัสนักเรียน ให้ถูกต้องและครบถ้วน',
  prefix     : 'กรุณาเลือกคำนำหน้า',
  first_name : 'กรุณากรอก ชื่อ ให้ถูกต้องและครบถ้วน',
  last_name  : 'กรุณากรอก นามสกุล ให้ถูกต้องและครบถ้วน',
  birth_date : 'กรุณาเลือก วัน/เดือน/ปี เกิด',
  education_stage: 'กรุณาเลือกระดับการศึกษา',
  grade      : 'กรุณาเลือกระดับชั้น',
  address    : 'กรุณากรอก ที่อยู่ ให้ถูกต้องและครบถ้วน',
  phone      : 'กรุณากรอก เบอร์โทรศัพท์ ให้ถูกต้องและครบถ้วน',
  status     : 'กรุณาเลือกสถานะ',
  room       : 'กรุณากรอก ห้อง ให้ถูกต้องและครบถ้วน',
};

export function validateStudent(v) {
  const e = {};
  if (!v.national_id || !re.nationalId.test(v.national_id)) e.national_id = MSG.national_id;
  if (!v.student_id  || !re.studentId .test(v.student_id )) e.student_id  = MSG.student_id;
  if (!v.prefix || !PREFIXES.includes(v.prefix)) e.prefix = MSG.prefix;
  if (!v.first_name || !re.thaiName.test(v.first_name)) e.first_name = MSG.first_name;
  if (!v.last_name  || !re.thaiName.test(v.last_name )) e.last_name  = MSG.last_name;
  if (!v.birth_date) e.birth_date = MSG.birth_date;

  if (!v.education_stage || !EDUCATION_STAGES.includes(v.education_stage)) e.education_stage = MSG.education_stage;
  if (!v.grade) e.grade = MSG.grade;

  if (!v.address || !re.address.test(v.address)) e.address = MSG.address;
  if (!v.phone   || !re.phone  .test(v.phone  )) e.phone   = MSG.phone;

  if (!v.room || !re.room.test(v.room)) e.room = MSG.room;
  if (!v.status || !STATUS_OPTIONS.includes(v.status)) e.status = MSG.status;

  return e;
}

export function validateStudentRow(rawRow) {
  const row  = normalizeStudentRow(rawRow);
  const errs = validateStudent(row);
  Object.assign(rawRow, row);
  return errs;
}