// src/features/teachers/TeacherApi.js
const KEY = 'teachers';

function load(){ try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
function uid(){ return crypto?.randomUUID ? crypto.randomUUID() : 'id_' + Math.random().toString(36).slice(2,11); }

export default {
  async list(){ return load(); },

  async create(payload){
    const list = load();
    const code  = String(payload.teacher_code || '').trim();
    const email = String(payload.email || '').trim().toLowerCase();

    if (code && list.some(t => String(t.teacher_code || '').trim() === code)) {
      const err = new Error('DUP_CODE'); err.code = 'DUP_CODE'; throw err;
    }
    if (email && list.some(t => String(t.email || '').trim().toLowerCase() === email)) {
      const err = new Error('DUP_EMAIL'); err.code = 'DUP_EMAIL'; throw err;
    }

    const item = { ...payload, id: uid(), createdAt: Date.now() };
    list.push(item); save(list);
    return { id: item.id };
  },

  async update(id, patch){
    const list = load();
    const i = list.findIndex(x => x.id === id);
    if (i >= 0) {
      const nextCode  = String(patch.teacher_code ?? list[i].teacher_code ?? '').trim();
      const nextEmail = String(patch.email ?? list[i].email ?? '').trim().toLowerCase();

      if (nextCode && list.some((t,idx)=> idx!==i && String(t.teacher_code || '').trim() === nextCode)) {
        const err = new Error('DUP_CODE'); err.code = 'DUP_CODE'; throw err;
      }
      if (nextEmail && list.some((t,idx)=> idx!==i && String(t.email || '').trim().toLowerCase() === nextEmail)) {
        const err = new Error('DUP_EMAIL'); err.code = 'DUP_EMAIL'; throw err;
      }

      list[i] = { ...list[i], ...patch, updatedAt: Date.now() };
      save(list);
    }
    return { ok:true };
  },

  async remove(id){
    save(load().filter(x => x.id !== id));
    return { ok:true };
  }
};