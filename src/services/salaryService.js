import api from './api';

const salaryService = {
  getSalaries: async (page, limit, startDate, endDate) => {
    try {
      const response = await api.get('/attendance/salaries', {
        params: {
          page,
          limit,
          start_date: startDate,
          end_date: endDate,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching salaries:', error);
      throw error;
    }
  },
};

export default salaryService;
