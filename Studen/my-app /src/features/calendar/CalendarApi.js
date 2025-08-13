// LocalStorage-based Calendar API
const KEY = 'calendar_items';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function save(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
}
function uid() {
  return globalThis.crypto?.randomUUID
    ? crypto.randomUUID()
    : 'cal_' + Math.random().toString(36).slice(2, 10);
}

async function list() {
  return load().sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
}

async function create(payload) {
  const list = load();
  const item = { ...payload, id: uid(), createdAt: Date.now() };
  list.push(item);
  save(list);
  return { id: item.id };
}

async function update(id, patch) {
  const list = load();
  const i = list.findIndex(x => x.id === id);
  if (i >= 0) {
    list[i] = { ...list[i], ...patch, updatedAt: Date.now() };
    save(list);
  }
  return { ok: true };
}

async function remove(id) {
  const list = load().filter(x => x.id !== id);
  save(list);
  return { ok: true };
}

const CalendarApi = { list, create, update, remove };
export default CalendarApi;