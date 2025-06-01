import apiClient from './api'; // Using the existing configured apiClient

const employeeService = {
  listEmployees(page = 1, limit = 10) {
    return apiClient.get('/employee/list', {
      params: { page, limit },
    });
  },

  createEmployee(employeeData) {
    // employeeData should be like { fullname: "testing123" }
    return apiClient.post('/employee/create', employeeData);
  },

  updateEmployee(employeeData) {
    // employeeData should be like { fullname: "testing345", employee_id: 3 }
    return apiClient.put('/employee/update', employeeData);
  },

  deleteEmployee(employeeId) {
    return apiClient.delete(`/employee/${employeeId}`);
  },
};

export default employeeService;
