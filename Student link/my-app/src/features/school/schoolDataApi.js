// src/features/school/schoolDataApi.js
const KEY = 'school_info';

function load() {
  try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch { return null; }
}
function save(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
  window.dispatchEvent(new Event('school:updated'));
}

const api = {
  async get() { return load(); },
  async create(payload) {
    const exists = load();
    if (exists) { const err = new Error('EXISTS'); err.code = 'EXISTS'; throw err; }
    const created = { id: 'school_1', ...payload, createdAt: Date.now() };
    save(created);
    return created;
  },
  async update(patch) {
    const current = load();
    const next = { ...(current || {}), ...patch, updatedAt: Date.now() };
    save(next);
    return next;
  },
  async remove() {
    localStorage.removeItem(KEY);
    window.dispatchEvent(new Event('school:updated'));
    return { ok: true };
  },
};
export default api;