// src/components/ui/Controls.jsx
import React from 'react';

// utils เล็กๆ สำหรับรวม class
function cx(...args) {
  return args.filter(Boolean).join(' ');
}

// ปุ่ม
export function Button({ variant = 'primary', size = 'md', className = '', ...props }) {
  const variants = {
    primary: 'btn',
    secondary: 'btn secondary',
    danger: 'btn danger',
  };
  const sizes = {
    sm: 'btn-sm',
    md: '',
    lg: 'btn-lg',
  };
  return (
    <button
      {...props}
      className={cx(variants[variant] || 'btn', sizes[size] || '', className)}
    />
  );
}

// อินพุตข้อความ
export function Input({ className = '', ...props }) {
  return <input {...props} className={cx('input', className)} />;
}

// กล่องเลือก (Dropdown)
export function Select({ className = '', children, ...props }) {
  return (
    <select {...props} className={cx('input', className)}>
      {children}
    </select>
  );
}

// ช่องกรอกข้อความหลายบรรทัด
export function Textarea({ className = '', ...props }) {
  return <textarea {...props} className={cx('input', className)} />;
}

// รองรับชื่อแบบ TextArea (alias ให้กับ Textarea)
export const TextArea = (props) => <Textarea {...props} />;

// ป้ายชื่อฟิลด์
export function Label({ className = '', ...props }) {
  return <label {...props} className={cx('label', className)} />;
}