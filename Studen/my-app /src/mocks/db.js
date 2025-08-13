// src/mocks/db.js
const NS = '__myapp__';
const LATENCY_MS = 250; // ปรับความหน่วงได้

function readAll() {
  try { return JSON.parse(localStorage.getItem(NS)) || {}; }
  catch { return {}; }
}
function writeAll(obj) {
  localStorage.setItem(NS, JSON.stringify(obj));
}

export const db = {
  async delay(ms = LATENCY_MS) { return new Promise(r => setTimeout(r, ms)); },

  get(key, fallback) {
    const all = readAll();
    return all[key] ?? fallback;
  },
  set(key, value) {
    const all = readAll();
    all[key] = value;
    writeAll(all);
  },
  push(key, item) {
    const list = db.get(key, []);
    list.push(item);
    db.set(key, list);
  },
  update(key, id, updater) {
    const list = db.get(key, []);
    const i = list.findIndex(x => x.id === id);
    if (i >= 0) list[i] = updater(list[i]);
    db.set(key, list);
  },
  remove(key, id) {
    const list = db.get(key, []);
    db.set(key, list.filter(x => x.id !== id));
  },
  reset() { writeAll({}); }
};

export function uid() {
  // ใช้ crypto ถ้ามี
  if (globalThis.crypto?.randomUUID) return crypto.randomUUID();
  return 'id_' + Math.random().toString(36).slice(2, 11);
}