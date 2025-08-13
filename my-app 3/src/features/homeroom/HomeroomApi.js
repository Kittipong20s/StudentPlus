// src/features/homeroom/HomeroomApi.js
const KEY = 'homerooms';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
function save(list) { localStorage.setItem(KEY, JSON.stringify(list)); }
function uid() {
  return globalThis.crypto?.randomUUID
    ? crypto.randomUUID()
    : 'id_' + Math.random().toString(36).slice(2, 11);
}

const HomeroomApi = {
  async list() { return load(); },
  async create(data) {
    const list = load();
    const item = { ...data, id: uid(), createdAt: Date.now() };
    list.push(item); save(list);
    return { id: item.id };
  },
  async update(id, patch) {
    const list = load();
    const i = list.findIndex(x => x.id === id);
    if (i >= 0) { list[i] = { ...list[i], ...patch }; save(list); }
    return { ok: true };
  },
  async remove(id) {
    save(load().filter(x => x.id !== id));
    return { ok: true };
  },
};
export default HomeroomApi; // ✅ default export