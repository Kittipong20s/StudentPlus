// src/features/school/schoolSchema.js

export const EDUCATION_LEVELS = [
  'อนุบาลศึกษา',
  'ประถมศึกษา',
  'มัธยมศึกษา',
  'ทุกระดับการสอน',
];

const re = {
  schoolCode: /^[ก-๙A-Za-z0-9]{1,20}$/,        // ไทย/อังกฤษ/ตัวเลข ≤20
  schoolName: /^[ก-๙0-9\s]{1,50}$/,            // ไทย+ตัวเลข+เว้นวรรค ≤50
  address: /^[ก-๙0-9\s.,/]{1,100}$/,           // ไทย+ตัวเลข+ . , / ≤100
  phone: /^[0-9\- ]{1,10}$/,                   // ตัวเลข ≤10 อนุญาต - และเว้นวรรค
};

const MSG = {
  school_code: 'กรุณากรอก รหัสโรงเรียน ให้ถูกต้องและครบถ้วน',
  school_name: 'กรุณากรอก ชื่อโรงเรียน ให้ถูกต้องและครบถ้วน',
  address: 'กรุณากรอก ที่อยู่โรงเรียน ให้ถูกต้องและครบถ้วน',
  phone: 'กรุณากรอก เบอร์โทรศัพท์ ให้ถูกต้องและครบถ้วน',
  education_level: 'กรุณาเลือกระดับการสอน',
};

export function validateSchool(v) {
  const e = {};
  if (!v.school_code || !re.schoolCode.test(v.school_code)) e.school_code = MSG.school_code;
  if (!v.school_name || !re.schoolName.test(v.school_name)) e.school_name = MSG.school_name;
  if (!v.address || !re.address.test(v.address)) e.address = MSG.address;
  if (!v.phone || !re.phone.test(v.phone)) e.phone = MSG.phone;
  if (!v.education_level || !EDUCATION_LEVELS.includes(v.education_level)) e.education_level = MSG.education_level;
  return e;
}