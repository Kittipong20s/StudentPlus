// src/features/teachers/teacherSchema.js
export const PREFIXES = ['นาย', 'นาง', 'นางสาว', 'ว่าที่ รต.', 'ดร.'];

// (ถ้าคุณยังใช้ที่อื่นอยู่ให้คงไว้ แต่จะไม่เอามาใช้ validate แล้ว)
// export const POSITIONS = ['ครูผู้สอน', 'ครูพิเศษ', 'ครูประจำชั้น', 'เจ้าหน้าที่']; 

// ทำความสะอาดค่าอินพุต (trim, lowercase อีเมล, ลบช่องว่างซ้อน)
export function normalizeTeacher(t = {}) {
  const trim = (s) => (s ?? '').toString().trim();
  const collapse = (s) => trim(s).replace(/\s+/g, ' ');
  const email = trim(t.email).toLowerCase();
  return {
    teacher_code: trim(t.teacher_code),
    prefix: trim(t.prefix),
    first_name: collapse(t.first_name),
    last_name: collapse(t.last_name),
    phone: trim(t.phone),
    email,
    position: collapse(t.position),
    id: t.id,
  };
}

// ตัวช่วย: เฉพาะตัวเลข
const onlyDigits = (s) => (s ?? '').toString().replace(/\D+/g, '');

// อนุญาตอีเมลมาตรฐาน (ยอมจุด . และโดเมน)
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
// ชื่อ-นามสกุล: ไทย/อังกฤษ + เว้นวรรค/ขีด ได้
const NAME_REGEX = /^[A-Za-zก-๙\- ]{1,50}$/u;
// รหัสครู: A-Z a-z 0-9 ไม่เกิน 20 ตัว
const CODE_REGEX = /^[A-Za-z0-9]{1,20}$/u;

export function validateTeacher(raw = {}, opts = {}) {
  const t = normalizeTeacher(raw);
  const e = {};

  // รหัสครู
  if (!t.teacher_code) e.teacher_code = 'กรุณากรอก รหัสประจำตัวคุณครู ให้ถูกต้องและครบถ้วน';
  else if (!CODE_REGEX.test(t.teacher_code)) e.teacher_code = 'รหัสครูต้องเป็นตัวอักษร/ตัวเลข ไม่เกิน 20 ตัว';
  if (opts.existsCode) e.teacher_code = 'หมายเลขรหัสประจำตัวคุณครูนี้ มีอยู่ในระบบอยู่แล้ว';

  // คำนำหน้า
  if (!t.prefix) e.prefix = 'กรุณาเลือกคำนำหน้า';
  else if (!PREFIXES.includes(t.prefix)) e.prefix = 'คำนำหน้าไม่ถูกต้อง';

  // ชื่อ/นามสกุล
  if (!t.first_name) e.first_name = 'กรุณากรอก ชื่อ ให้ถูกต้องและครบถ้วน';
  else if (!NAME_REGEX.test(t.first_name)) e.first_name = 'ชื่อรองรับภาษาไทย/อังกฤษ เว้นวรรค/ขีด (ไม่เกิน 50)';
  if (!t.last_name) e.last_name = 'กรุณากรอก นามสกุล ให้ถูกต้องและครบถ้วน';
  else if (!NAME_REGEX.test(t.last_name)) e.last_name = 'นามสกุลองรับภาษาไทย/อังกฤษ เว้นวรรค/ขีด (ไม่เกิน 50)';

  // เบอร์โทร (นับเฉพาะตัวเลข)
  const digits = onlyDigits(t.phone);
  if (!digits) e.phone = 'กรุณากรอก เบอร์โทร ให้ถูกต้องและครบถ้วน';
  else if (digits.length < 9 || digits.length > 10) e.phone = 'เบอร์โทรต้องมี 9–10 หลัก (ใส่ขีด/เว้นวรรคได้)';

  // อีเมล (ยอม . และ โดเมน)
  if (!t.email) e.email = 'กรุณากรอก อีเมล ให้ถูกต้องและครบถ้วน';
  else if (t.email.length > 50) e.email = 'อีเมลต้องไม่เกิน 50 ตัวอักษร';
  else if (!EMAIL_REGEX.test(t.email)) e.email = 'รูปแบบอีเมลไม่ถูกต้อง';
  if (opts.existsEmail) e.email = 'อีเมลนี้ มีอยู่ในระบบอยู่แล้ว';

  // ตำแหน่ง: เปลี่ยนเป็น “พิมพ์เองได้” — ไม่ lock ลิสต์
  if (!t.position) e.position = 'กรุณากรอก ตำแหน่ง ให้ถูกต้องและครบถ้วน';
  else if (t.position.length > 50) e.position = 'ตำแหน่งต้องไม่เกิน 50 ตัวอักษร';

  return e;
}