// src/components/SearchBox.jsx
import React, { useEffect, useRef, useState } from 'react';

export default function SearchBox({ placeholder = 'ค้นหา...', value, onChange, delay = 250 }) {
  const [q, setQ] = useState(value || '');
  const timer = useRef();

  useEffect(() => setQ(value || ''), [value]);

  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => onChange && onChange(q), delay);
    return () => clearTimeout(timer.current);
  }, [q, delay, onChange]);

  return (
    <input
      value={q}
      onChange={(e) => setQ(e.target.value)}
      placeholder={placeholder}
      className="input"
      style={{ width: '100%' }}
    />
  );
}