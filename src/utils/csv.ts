// src/utils/csv.ts
export function toCSV(filename: string, rows: any[], headers?: string[]) {
  if (!rows || rows.length === 0) return;
  const keys = headers || Object.keys(rows[0]);
  const escape = (v: any) => '"' + String(v ?? '').replace(/"/g, '""') + '"';
  const text = [keys.join(','), ...rows.map(r => keys.map(k => escape(r[k])).join(','))].join('\n');
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url);
}