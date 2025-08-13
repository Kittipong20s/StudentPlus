// ตัวเลือก dropdown และ validate ตาม AC

export const SEMESTERS = ['ภาคเรียนที่ 1', 'ภาคเรียนที่ 2'];

export function thaiAcademicYears(n = 4) {
  // ตัวอย่าง AC ใช้ พ.ศ. เช่น 2568..2571
  const thYear = new Date().getFullYear() + 543;
  return Array.from({ length: n + 1 }, (_, i) => String(thYear + i));
}

export const HOLIDAY_TYPES = [
  'วันปีใหม่', 'วันสงกรานต์', 'วันแรงงาน', 'วันพ่อ', 'วันแม่', 'วันครู', 'อื่นๆ'
];

export const EVENT_TYPES = [
  'งานกีฬาสี', 'สอบกลางภาค', 'สอบปลายภาค', 'อื่นๆ'
];

export const MSG = {
  closeBeforeOpen: 'วันปิดภาคเรียนต้องไม่ก่อนวันเปิดภาคเรียน',
  endBeforeStart: 'วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่มต้น',
  timeEndBeforeStart: 'เวลาเลิกเรียนต้องมากกว่าเวลาเข้าเรียน',
  eventTimeEndBeforeStart: 'เวลาเลิกกิจกรรมต้องมากกว่าเวลาเริ่ม',
};

export function validateNormalDay(v) {
  const e = {};
  if (!v.semester) e.semester = 'กรุณาเลือกภาคการศึกษา';
  if (!v.academic_year) e.academic_year = 'กรุณาเลือกปีการศึกษา';
  if (!v.open_date) e.open_date = 'กรุณาเลือกวันเปิดภาคเรียน';
  if (!v.close_date) e.close_date = 'กรุณาเลือกวันปิดภาคเรียน';
  if (v.open_date && v.close_date && v.close_date < v.open_date) e.close_date = MSG.closeBeforeOpen;
  if (!v.time_in) e.time_in = 'กรุณาเลือกเวลาเข้าเรียน';
  if (!v.time_out) e.time_out = 'กรุณาเลือกเวลาเลิกเรียน';
  if (v.time_in && v.time_out && v.time_out <= v.time_in) e.time_out = MSG.timeEndBeforeStart;
  return e;
}

export function validateHoliday(v) {
  const e = {};
  if (!v.start_date) e.start_date = 'กรุณาเลือกวันที่เริ่มต้น';
  if (v.end_date && v.start_date && v.end_date < v.start_date) e.end_date = MSG.endBeforeStart;
  if (!v.type) e.type = 'กรุณาเลือกประเภทวันหยุด';
  if (v.type === 'อื่นๆ' && (!v.custom || v.custom.length === 0)) e.custom = 'กรุณากรอกชื่อวันหยุด';
  if (v.note && v.note.length > 200) e.note = 'หมายเหตุยาวเกิน 200 ตัวอักษร';
  return e;
}

export function validateEvent(v) {
  const e = {};
  if (!v.date) e.date = 'กรุณาเลือกวันที่จัดกิจกรรม';
  if (!v.start_time) e.start_time = 'กรุณาเลือกเวลาเริ่ม';
  if (!v.end_time) e.end_time = 'กรุณาเลือกเวลาเลิก';
  if (v.start_time && v.end_time && v.end_time <= v.start_time) e.end_time = MSG.eventTimeEndBeforeStart;
  if (!v.name) e.name = 'กรุณาเลือกชื่อกิจกรรม';
  if (v.name === 'อื่นๆ' && (!v.custom || v.custom.length === 0)) e.custom = 'กรุณากรอกชื่อกิจกรรม';
  if (v.note && v.note.length > 200) e.note = 'หมายเหตุยาวเกิน 200 ตัวอักษร';
  return e;
}