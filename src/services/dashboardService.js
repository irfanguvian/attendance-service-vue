import apiClient from './api';
import { format } from 'date-fns';

const dashboardService = {
  getSummaryToday() {
    return apiClient.get('/attendance/summary-today');
  },

  getDailyTrends(startDate, endDate) {
    // Format dates to ensure consistency with API expectations
    const formattedStartDate = typeof startDate === 'string' ? startDate : format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = typeof endDate === 'string' ? endDate : format(endDate, 'yyyy-MM-dd');
    
    return apiClient.get('/attendance/analytics/daily-trends', {
      params: {
        start_date: formattedStartDate,
        end_date: formattedEndDate
      }
    });
  },

  getMonthlyTrends(startDate, endDate) {
    const formattedStartDate = typeof startDate === 'string' ? startDate : format(startDate, 'yyyy-MM-dd');
    const formattedEndDate = typeof endDate === 'string' ? endDate : format(endDate, 'yyyy-MM-dd');

    return apiClient.get('/attendance/analytics/monthly-trends', {
      params: {
        start_date: formattedStartDate,
        end_date: formattedEndDate,
      },
    });
  }
};

export default dashboardService;
