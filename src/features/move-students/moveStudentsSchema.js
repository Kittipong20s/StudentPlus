// src/features/move-students/moveSchema.js

// พ.ศ. สำหรับโชว์ "ปี–ชั้น–ห้อง"
export function currentThaiYear() {
  return String(new Date().getFullYear() + 543);
}

// "ปี–ชั้น–ห้อง"
export function displayRoom(studentOrTuple) {
  if (Array.isArray(studentOrTuple)) {
    const [grade, room] = studentOrTuple;
    return `${currentThaiYear()}–${grade}-${room}`;
  }
  const s = studentOrTuple || {};
  return `${currentThaiYear()}–${s.grade || '-'}-${s.room || '-'}`;
}

// ตรวจข้อมูลก่อนย้าย
export function validateMove({ selected, newRoom, moveDate, fromRoom }) {
  const e = {};
  if (!selected || selected.length === 0) e.students = 'กรุณาเลือกนักเรียน';
  if (!newRoom) e.newRoom = 'กรุณาเลือกห้องใหม่';
  if (!moveDate) e.moveDate = 'กรุณาเลือกวันที่ย้าย';
  if (newRoom && String(newRoom) === String(fromRoom)) e.newRoom = 'ห้องเรียนใหม่ต้องไม่ซ้ำห้องเดิม';
  return e;
}

// นักเรียนทุกคนอยู่ห้องเดียวกันไหม (ชั้น-ห้อง)
export function isSameRoom(students) {
  if (!students || students.length === 0) return true;
  const g = students[0].grade;
  const r = students[0].room;
  return students.every(s => s.grade === g && s.room === r);
}