// src/hooks/useToast.js

let listeners = [];

/** สมัครตัวรับ toast */
export function subscribeToast(fn) {
  listeners.push(fn);
}

/** ยกเลิกตัวรับ toast */
export function unsubscribeToast(fn) {
  listeners = listeners.filter((x) => x !== fn);
}

let id = 0;
/**
 * ยิง toast
 * ตัวอย่าง:
 *   toast({ title: 'สำเร็จ', message: 'บันทึกแล้ว', variant: 'success', duration: 2500 })
 *   toast({ message: 'เกิดข้อผิดพลาด', variant: 'error' })
 */
export function toast(payload) {
  const t = { id: ++id, duration: 2500, ...payload };
  listeners.forEach((fn) => fn(t));
}