// src/features/students/StudentApi.js  (ตัวอย่างโครง)
const KEY = 'students';

function load(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
function uid(){ return crypto?.randomUUID ? crypto.randomUUID() : 'id_' + Math.random().toString(36).slice(2, 11); }

const StudentApi = {
  async list(){ return load(); },

  async create(payload){
    const list = load();
    const id = String(payload.student_id || '').trim();
    if (id && list.some(s => String(s.student_id || '').trim() === id)) {
      const err = new Error('DUP_STUDENT_ID');
      err.code = 'DUP_STUDENT_ID';
      throw err;
    }
    const item = { ...payload, id: uid(), createdAt: Date.now() };
    list.push(item); save(list);
    return { id: item.id };
  },

  async update(id, patch){
    const list = load();
    const i = list.findIndex(x => x.id === id);
    if (i >= 0) {
      // กันรหัสซ้ำตอนแก้ไข (ยกเว้นตัวเอง)
      const nextCode = String(patch.student_id ?? list[i].student_id ?? '').trim();
      if (nextCode && list.some((s,idx) => idx!==i && String(s.student_id || '').trim() === nextCode)) {
        const err = new Error('DUP_STUDENT_ID');
        err.code = 'DUP_STUDENT_ID';
        throw err;
      }
      list[i] = { ...list[i], ...patch, updatedAt: Date.now() };
      save(list);
    }
    return { ok: true };
  },

  async remove(id){
    save(load().filter(x => x.id !== id));
    return { ok: true };
  }
};

export default StudentApi;