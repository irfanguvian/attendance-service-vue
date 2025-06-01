import apiClient from './api';

const attendanceService = {
  createAttendance(data) {
    // API requires: { "employee_id": 1, "clock_in": "2025-05-01T13:12:03+07:00" }
    return apiClient.post('/attendance/create', data);
  },

  listTodayAttendance(page = 1, limit = 10) {
    return apiClient.get(`/attendance/list-today?page=${page}&limit=${limit}`);
  }
};

export default attendanceService;
