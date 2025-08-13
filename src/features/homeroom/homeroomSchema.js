// src/features/homeroom/homeroomSchema.js

export const EDUCATION_STAGES = ['อนุบาลศึกษา', 'ประถมศึกษา', 'มัธยมศึกษา'];
export const POSITIONS_HM = ['ครูประจำชั้นหลัก', 'ครูประจำชั้นรอง'];

export const GRADE_OPTIONS = {
  'อนุบาลศึกษา': ['อนุบาล 1', 'อนุบาล 2', 'อนุบาล 3'],
  'ประถมศึกษา': ['ประถม 1', 'ประถม 2', 'ประถม 3', 'ประถม 4', 'ประถม 5', 'ประถม 6'],
  'มัธยมศึกษา': ['มัธยม 1', 'มัธยม 2', 'มัธยม 3', 'มัธยม 4', 'มัธยม 5', 'มัธยม 6'],
};

export function nextAcademicYears(count = 5) {
  const thisYear = new Date().getFullYear(); // AC ตัวอย่าง 2025.. ใช้ ค.ศ.
  return Array.from({ length: count }, (_, i) => String(thisYear + i));
}

// ตรวจข้อมูลตาม AC + ตรวจ duplicate “ครูประจำชั้นหลัก”
export function validateHomeroom(v, existing = []) {
  const e = {};
  if (!v.academic_year) e.academic_year = 'กรุณาเลือกปีการศึกษา';
  if (!v.education_stage) e.education_stage = 'กรุณาเลือกระดับการศึกษา';
  if (!v.grade) e.grade = 'กรุณาเลือกระดับชั้นการศึกษา';
  if (!v.room || !/^[0-9]{1,5}$/.test(v.room)) e.room = 'กรุณากรอก ห้องเรียน ให้ถูกต้องและครบถ้วน';
  if (!v.position) e.position = 'กรุณากรอก ตำแหน่ง ให้ถูกต้องและครบถ้วน';

  // ช่องคุณครูประจำชั้นเปิด/ปิดตาม position แต่ถ้าเปิด ต้องกรอก
  const requireTeacher = !!v.position;
  if (requireTeacher && !v.teacher_id) e.teacher_id = 'กรุณาเลือกครูประจำชั้น';

  // ห้ามครูที่เป็น "ประจำชั้นหลัก" ซ้ำห้องอื่น
  if (v.position === 'ครูประจำชั้นหลัก' && v.teacher_id) {
    const usedAsMain = existing.some(
      (it) =>
        it.position === 'ครูประจำชั้นหลัก' &&
        it.teacher_id === v.teacher_id &&
        // ถ้าเป็นโหมดแก้ไข จะมี id เดิม — ไม่ต้องชนกับตัวเอง
        (String(it.id) !== String(v.id || ''))
    );
    if (usedAsMain) {
      e.teacher_id = 'ครูคนนี้เป็นประจำชั้นหลักห้องอื่นอยู่แล้ว';
    }
  }
  return e;
}