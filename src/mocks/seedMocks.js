// src/mocks/seedMocks.js

// ตั้งค่า: true = เปิด seed, false = ปิด
const ENABLE_SEED = true;

// ใช้ key ให้ตรงกับ API/localStorage ที่โปรเจกต์ใช้
const KEYS = {
  school:   'school_info',
  teachers: 'teachers',
  students: 'students',
  calendar: 'calendar_items',
  moves:    'move_students_history',
  homeroom: 'homerooms', // ✅ ยึดให้ตรงกับ HomeroomApi
};

function safeGet(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    // ป้องกัน no-empty + ช่วย debug
    console.warn('[seedMocks] safeGet error for key:', key, err);
    return fallback;
  }
}
function safeSet(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('[seedMocks] safeSet error for key:', key, err);
  }
}

// ---- mock payloads (ตัวอย่าง) ----
import { mockSchool }   from './mockSchool';
import { mockTeachers } from './mockTeachers';
import { mockStudents } from './mockStudents';
import { mockCalendar } from './mockCalendar';
import { mockMoves }    from './mockMoves';
import { mockHomeroom } from './mockHomeroom';

// ---- ย้ายข้อมูลเก่าจาก homeroom_list -> homerooms (ครั้งเดียว) ----
(function migrateHomeroomKeyOnce() {
  try {
    const oldKey = 'homeroom_list';
    const newKey = KEYS.homeroom;
    const oldRaw = localStorage.getItem(oldKey);
    const newRaw = localStorage.getItem(newKey);
    if (oldRaw && !newRaw) {
      localStorage.setItem(newKey, oldRaw);
      // ไม่ลบ oldKey เพื่อให้ย้อนกลับได้ถ้าจำเป็น
      console.log('[seedMocks] migrated homeroom_list -> homerooms');
    }
  } catch (err) {
    // ป้องกัน no-empty + log ไว้พอเห็นอาการ
    console.warn('[seedMocks] migrateHomeroomKeyOnce failed:', err);
  }
})();

(function seed() {
  if (!ENABLE_SEED) return;

  // ใส่เฉพาะตอน "ยังไม่มี" เท่านั้น
  if (!safeGet(KEYS.school, null))                     safeSet(KEYS.school,   mockSchool);
  if (!Array.isArray(safeGet(KEYS.teachers, null)))    safeSet(KEYS.teachers, mockTeachers);
  if (!Array.isArray(safeGet(KEYS.students, null)))    safeSet(KEYS.students, mockStudents);
  if (!Array.isArray(safeGet(KEYS.calendar, null)))    safeSet(KEYS.calendar, mockCalendar);
  if (!Array.isArray(safeGet(KEYS.moves, null)))       safeSet(KEYS.moves,    mockMoves);
  if (!Array.isArray(safeGet(KEYS.homeroom, null)))    safeSet(KEYS.homeroom, mockHomeroom);

  // แจ้ง navbar ให้รีเฟรชชื่อโรงเรียน (ตามที่คุณทำไว้)
  try {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('school:updated'));
    }
  } catch (err) {
    console.warn('[seedMocks] dispatch school:updated failed:', err);
  }
})();