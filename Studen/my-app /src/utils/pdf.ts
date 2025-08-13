// src/utils/pdf.ts
// เวอร์ชันง่าย: เปิดหน้าพิมพ์ให้ผู้ใช้กด Save as PDF เอง
export function printAsPdf(title: string, html: string) {
  const w = window.open('', '_blank');
  if (!w) return;
  w.document.write(`<!doctype html><html><head><title>${title}</title></head><body>${html}</body></html>`);
  w.document.close();
  w.focus();
  w.print();
}