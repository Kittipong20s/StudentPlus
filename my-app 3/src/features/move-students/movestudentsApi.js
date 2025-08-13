const KEY = 'move_students_history';

function load(){ try{ return JSON.parse(localStorage.getItem(KEY) || '[]'); }catch{ return []; } }
function save(list){ localStorage.setItem(KEY, JSON.stringify(list)); }
function uid(){ return globalThis.crypto?.randomUUID ? crypto.randomUUID() : 'mv_' + Math.random().toString(36).slice(2,10); }

const MoveApi = {
  async list(){ return load().sort((a,b)=> (a.createdAt||0) - (b.createdAt||0)); },
  async create(payload){
    const list = load();
    const item = { id: uid(), createdAt: Date.now(), ...payload };
    list.push(item); save(list);
    return { id: item.id };
  },
  async update(id, patch){
    const list = load();
    const i = list.findIndex(x => x.id === id);
    if (i >= 0) { list[i] = { ...list[i], ...patch, updatedAt: Date.now() }; save(list); }
    return { ok: true };
  },
  async remove(id){
    save(load().filter(x => x.id !== id));
    return { ok: true };
  }
};
export default MoveApi;