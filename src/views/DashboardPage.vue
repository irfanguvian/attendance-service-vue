<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h2 class="page-title">Dashboard Overview</h2>
      <DateRangeFilter @date-range-changed="handleDateRangeChange" />
    </div>

    <div class="summary-section">
      <SummaryCard 
        title="Today's Present"
        :value="summaryData.presentToday"
        icon-type="present"
        :subtitle="`${summaryData.attendanceRate}% Attendance Rate`"
      />
      <SummaryCard 
        title="Today's Absent"
        :value="summaryData.absentToday"
        icon-type="absent"
        :subtitle="`${summaryData.absenceRate}% Absence Rate`"
      />
      <SummaryCard 
        title="Total Employees"
        :value="summaryData.totalEmployees" 
        icon-type="totalEmployees"
        :subtitle="`As of ${summaryData.date}`"
      />
      <!-- Add more summary cards as needed -->
    </div>

    <div class="charts-section">
      <div class="chart-wrapper">
        <DataChart 
          chartId="dailyPresenceChart"
          title="Daily Presence/Absence Trend"
          :chartData="dailyPresenceData" 
        />
      </div>
    </div>

    <div class="monthly-trends-section" v-if="monthlyTrends && monthlyTrends.length > 0">
      <h3 class="section-title">Monthly Performance Insights</h3>
      <div class="trends-grid">
        <MonthlyTrendCard 
          v-for="(trend, index) in monthlyTrends" 
          :key="index" 
          :trend="trend" 
        />
      </div>
    </div>
    <div v-else-if="isLoadingMonthlyTrends" class="loading-message">
      <p>Loading monthly trends...</p>
    </div>
    <div v-else class="no-data-message">
      <p>No monthly trend data available for the selected period.</p>
    </div>

  </div>
</template>

<script>
import SummaryCard from '@/components/dashboard/SummaryCard.vue';
import DataChart from '@/components/dashboard/DataChart.vue';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter.vue';
import MonthlyTrendCard from '@/components/dashboard/MonthlyTrendCard.vue'; // Import new component
import dashboardService from '@/services/dashboardService.js';

export default {
  name: 'DashboardPage',
  components: {
    SummaryCard,
    DataChart,
    DateRangeFilter,
    MonthlyTrendCard, // Register new component
  },
  data() {
    return {
      selectedDateRange: {
        startDate: new Date().toISOString().slice(0, 10),
        endDate: new Date().toISOString().slice(0, 10),
      },
      summaryData: {
        presentToday: 0, 
        absentToday: 0,  
        totalEmployees: 0,
        attendanceRate: 0,
        absenceRate: 0,
        date: new Date().toISOString().slice(0, 10), // Today's date as default
      },
      dailyPresenceData: { 
        labels: [],
        datasets: [
          {
            label: 'Present',
            backgroundColor: '#36A2EB',
            borderColor: '#36A2EB',
            data: [],
          },
          {
            label: 'Absent',
            backgroundColor: '#FF6384',
            borderColor: '#FF6384',
            data: [],
          },
        ],
      },
      monthlySalaryData: { // This is for the mock salary trend chart
        labels: [],
        datasets: [
          {
            label: 'Total Salary',
            backgroundColor: '#4BC0C0',
            borderColor: '#4BC0C0',
            data: [],
            type: 'line',
            fill: false,
            tension: 0.1,
          },
        ],
      },
      isLoadingMonthlyTrends: false, // Add loading state for monthly trends
      monthlyTrends: [],
    };
  },
  methods: {
    showSuccessToast(message) {
      if (this.$root.toaster) {
        this.$root.toaster.showToast(message, "success");
      }
    },
    showErrorToast(message) {
      if (this.$root.toaster) {
        this.$root.toaster.showToast(message, "error");
      }
    },
    async fetchTodaySummary() {
      try {
        const response = await dashboardService.getSummaryToday();
        const data = response.data;
        
        this.summaryData.presentToday = data.data.present_count;
        this.summaryData.absentToday = data.data.absent_count;
        this.summaryData.totalEmployees = data.data.total_employees;
        this.summaryData.attendanceRate = Math.round(data.data.attendance_rate * 100) / 100; // Round to 2 decimal places
        this.summaryData.absenceRate = Math.round(data.data.absence_rate * 100) / 100; // Round to 2 decimal places
        this.summaryData.date = data.data.date;
        
      } catch (error) {
        console.error('Error fetching today summary:', error);
        this.showErrorToast(error.response?.data?.error || error.message || 'Failed to fetch today\'s summary.');
        // Keep default/previous values on error
      }
    },
    async fetchDailyTrends() {
      try {
        const response = await dashboardService.getDailyTrends(
          this.selectedDateRange.startDate,
          this.selectedDateRange.endDate
        );
        const data = response.data;
        
        if (data.success && data.data && Array.isArray(data.data)) {
          const trendsData = data.data;
          
          const labels = trendsData.map(item => item.date);
          const presentData = trendsData.map(item => item.present_count || 0);
          const absentData = trendsData.map(item => item.absent_count || 0);
          
          this.dailyPresenceData = {
            labels: labels,
            datasets: [
              {
                label: 'Present',
                backgroundColor: '#36A2EB',
                borderColor: '#36A2EB',
                data: presentData,
                tension: 0.1,
              },
              {
                label: 'Absent',
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                data: absentData,
                tension: 0.1,
              },
            ],
          };
        } else {
          // Fallback to empty data if no trends available
          this.dailyPresenceData = {
            labels: [],
            datasets: [
              { label: 'Present', backgroundColor: '#36A2EB', borderColor: '#36A2EB', data: [] },
              { label: 'Absent', backgroundColor: '#FF6384', borderColor: '#FF6384', data: [] },
            ],
          };
        }
      } catch (error) {
        console.error('Error fetching daily trends:', error);
        this.showErrorToast(error.response?.data?.error || error.message || 'Failed to fetch daily trends data.');
        
        // Keep current data or set to empty on error
        this.dailyPresenceData = {
          labels: [],
          datasets: [
            { label: 'Present', backgroundColor: '#36A2EB', borderColor: '#36A2EB', data: [] },
            { label: 'Absent', backgroundColor: '#FF6384', borderColor: '#FF6384', data: [] },
          ],
        };
      }
    },
    fetchMonthlySalaryData() {
      // Mock data for monthly salary trends - can be replaced with real API later
      const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      // Calculate reasonable number of months based on date range
      const startDate = new Date(this.selectedDateRange.startDate);
      const endDate = new Date(this.selectedDateRange.endDate);
      const daysDiff = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      const numMonths = Math.min(12, Math.max(1, Math.ceil(daysDiff / 30)));
      
      const salaryTrend = Array.from({ length: numMonths }, () => Math.floor(Math.random() * 50000) + 100000);
      
      this.monthlySalaryData = {
        labels: monthlyLabels.slice(0, numMonths),
        datasets: [
          {
            label: 'Total Salary',
            backgroundColor: '#4BC0C0',
            borderColor: '#4BC0C0',
            data: salaryTrend,
            type: 'line',
            fill: false,
            tension: 0.1,
          },
        ],
      };
    },
    async fetchMonthlyTrends() {
      this.isLoadingMonthlyTrends = true; // Optional: for loading state
      try {
        const response = await dashboardService.getMonthlyTrends(
          this.selectedDateRange.startDate,
          this.selectedDateRange.endDate
        );
        if (response.data && response.data.success) {
          this.monthlyTrends = response.data.data; 
        } else {
          this.monthlyTrends = [];
          this.showErrorToast(response.data.message || 'Failed to fetch monthly trends.');
        }
      } catch (error) {
        console.error('Error fetching monthly trends:', error);
        this.showErrorToast(error.response?.data?.error || error.message || 'Failed to fetch monthly trends data.');
        this.monthlyTrends = [];
      }
      this.isLoadingMonthlyTrends = false;
    },
    handleDateRangeChange(range) {
      this.selectedDateRange = range;
      this.fetchDailyTrends();
      this.fetchMonthlySalaryData(); // This is for the mock chart
      this.fetchMonthlyTrends(); // Fetch new monthly trends data
    },
  },
  async created() {
    await this.fetchTodaySummary();
    this.fetchDailyTrends();
    this.fetchMonthlySalaryData(); // This is for the mock chart
    this.fetchMonthlyTrends(); // Fetch new monthly trends data
  },
};
</script>

<style scoped>
.dashboard-page {
  padding: 20px; /* Standardized padding */
  background-color: #f0f2f5;
  min-height: calc(100vh - 70px); 
}

.page-header {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping */
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px; /* Adjusted margin */
  padding-bottom: 15px; /* Adjusted padding */
  border-bottom: 1px solid #dee2e6;
}

.page-title {
  color: #1a202c;
  margin: 0 0 10px 0; /* Add bottom margin for spacing when wrapped */
  font-size: 1.75rem; /* Slightly adjusted font size */
  font-weight: 600;
}

.summary-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); /* Wider minmax for cards */
  gap: 20px;
  margin-bottom: 25px; /* Adjusted margin */
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr; /* Default to single column */
  gap: 20px; /* Adjusted gap */
}

.chart-wrapper {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  overflow: hidden; /* Prevent content from overflowing */
}

.monthly-trends-section {
  margin-top: 30px;
}

.section-title {
  font-size: 1.5rem;
  color: #1a202c;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e2e8f0;
}

.trends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.loading-message p,
.no-data-message p {
  text-align: center;
  color: #718096;
  font-size: 1.1em;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .page-title {
    margin-bottom: 0; /* Reset bottom margin for larger screens */
  }
  .summary-section {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); /* Slightly wider for medium screens */
  }
}

@media (min-width: 1024px) { /* Changed from 992px for better breakpoint */
  .charts-section {
    grid-template-columns: repeat(2, 1fr); /* Two columns for charts */
  }
}

@media (max-width: 640px) { /* Changed from 600px for better breakpoint */
  .dashboard-page {
    padding: 15px;
  }
  .page-header {
    flex-direction: column;
    align-items: stretch; /* Stretch items to full width */
  }
  .page-title {
    text-align: center; /* Center title on small screens */
    margin-bottom: 15px;
  }
  .summary-section {
    grid-template-columns: 1fr; /* Single column for cards */
    gap: 15px;
  }
  .charts-section {
    gap: 15px;
  }
  .chart-wrapper {
    padding: 15px;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.5rem; /* Smaller title for very small screens */
  }
  /* DateRangeFilter might need its own internal responsive adjustments */
}
</style>
