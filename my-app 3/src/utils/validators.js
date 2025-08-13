// src/utils/validators.js

export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[0-9\-\s]{1,20}$/,
};

export const required = (v, msg = 'จำเป็นต้องกรอก') => (!v ? msg : '');
export const pattern = (v, re, msg) => (v && !re.test(v) ? msg : '');
export const minLen = (v, n, msg) => (v && String(v).length < n ? msg : '');
export const maxLen = (v, n, msg) => (v && String(v).length > n ? msg : '');

export function validate(obj, rules) {
  // rules: { field: [(v)=>''|msg, ...] }
  const e = {};
  for (const [field, fns] of Object.entries(rules)) {
    for (const fn of fns) {
      const m = fn(obj[field]);
      if (m) { e[field] = m; break; }
    }
  }
  return e;
}