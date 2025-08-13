// src/mocks/mockCalendar.js
export const mockCalendar = [
  // วันปกติ (ภาคเรียน)
  {
    id: 'cal_n_001',
    type: 'normal',
    semester: 'ภาคเรียนที่ 1',
    academic_year: String(new Date().getFullYear() + 543),
    open_date: '2025-05-16',
    close_date: '2025-10-01',
    time_in: '08:00',
    time_out: '15:30',
    createdAt: Date.now()
  },
  // วันหยุด
  {
    id: 'cal_h_001',
    type: 'holiday',
    name: 'วันแม่',
    start_date: '2025-08-12',
    end_date: '',
    note: 'หยุด 1 วัน',
    createdAt: Date.now()
  },
  // กิจกรรม
  {
    id: 'cal_e_001',
    type: 'event',
    title: 'งานกีฬาสี',
    date: '2025-09-20',
    start_time: '09:00',
    end_time: '16:00',
    note: 'ใส่ชุดกีฬา',
    createdAt: Date.now()
  }
];

export default mockCalendar;