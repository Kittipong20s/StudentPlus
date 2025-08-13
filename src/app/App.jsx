// src/app/App.jsx
// src/app/App.jsx (หรือ src/main.jsx)
import '../styles/table.css';
import '../mocks/seedMocks';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import { NAV_ITEMS, ROUTES } from './routes';

import AddSchoolPage from '../features/school/AddSchoolPage';
import TeachersPage from '../features/teachers/TeachersPage';
import StudentsPage from '../features/students/StudentsPage';
import HomeroomAssignPage from '../features/homeroom/HomeroomAssignPage';
import CalendarSettingsPage from '../features/calendar/CalendarSettingsPage';
import MoveStudentsPage from '../features/move-students/MoveStudentsPage';
import LeaveReportPage from '../features/leave-report/LeaveReportPage';
import AnnouncementsPage from '../features/announcements/AnnouncementsPage';

import ToastHost from '../components/ToastHost';
// (ถ้าใช้ mock seed อยู่)
// import '../mocks/seedMocks';

function Sidebar() {
  const [schoolName, setSchoolName] = useState('');

  const readName = () => {
    try {
      const raw = localStorage.getItem('school_info');
      const s = raw ? JSON.parse(raw) : null;
      setSchoolName(s?.school_name || '');
    } catch { setSchoolName(''); }
  };

  useEffect(() => {
    readName();
    const onUpd = () => readName();
    window.addEventListener('school:updated', onUpd);
    window.addEventListener('storage', onUpd);
    return () => {
      window.removeEventListener('school:updated', onUpd);
      window.removeEventListener('storage', onUpd);
    };
  }, []);

  return (
    <aside
      style={{
        width: 240,
        background: '#0f172a',
        color: '#e2e8f0',
        minHeight: '100vh',
        position: 'sticky',
        top: 0,
        left: 0,
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
      }}
    >
      <div
        style={{
          fontWeight: 800,
          fontSize: 18,
          background: '#111827',
          color: '#fff',
          padding: '10px 12px',
          borderRadius: 10,
        }}
        title={schoolName || 'StudentPlus'}
      >
        {schoolName ? `🏫 ${schoolName}` : 'StudentPlus'}
      </div>

      <nav style={{ display: 'grid', gap: 6 }}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            style={({ isActive }) => ({
              color: isActive ? '#0f172a' : '#e2e8f0',
              background: isActive ? '#a5b4fc' : 'transparent',
              padding: '8px 10px',
              borderRadius: 8,
              textDecoration: 'none',
              display: 'block',
            })}
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', fontSize: 12, opacity: 0.7 }}>
        © {new Date().getFullYear()} StudentPlus
      </div>
    </aside>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <Sidebar />
        <main style={{ flex: 1, padding: 16 }}>
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <ToastHost />
            <Routes>
              <Route path="/" element={<Navigate to={ROUTES.SCHOOL} replace />} />
              <Route path={ROUTES.SCHOOL} element={<AddSchoolPage />} />
              <Route path={ROUTES.TEACHERS} element={<TeachersPage />} />
              <Route path={ROUTES.STUDENTS} element={<StudentsPage />} />
              <Route path={ROUTES.HOMEROOM} element={<HomeroomAssignPage />} />
              <Route path={ROUTES.CALENDAR} element={<CalendarSettingsPage />} />
              <Route path={ROUTES.MOVE_STUDENTS} element={<MoveStudentsPage />} />
              <Route path={ROUTES.LEAVE_REPORT} element={<LeaveReportPage />} />
              <Route path={ROUTES.ANNOUNCEMENTS} element={<AnnouncementsPage />} />
              <Route path="*" element={<div>ไม่พบหน้าที่ต้องการ (404)</div>} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}