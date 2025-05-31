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
      />
      <SummaryCard 
        title="Today's Absent"
        :value="summaryData.absentToday"
        icon-type="absent"
      />
      <SummaryCard 
        title="Total Employees"
        :value="summaryData.totalEmployees" 
        icon-type="totalEmployees"
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
      <div class="chart-wrapper">
        <DataChart 
          chartId="monthlySalaryChart"
          title="Monthly Total Salary Trend"
          :chartData="monthlySalaryData" 
        />
      </div>
    </div>

  </div>
</template>

<script>
import SummaryCard from '@/components/dashboard/SummaryCard.vue';
import DataChart from '@/components/dashboard/DataChart.vue';
import DateRangeFilter from '@/components/dashboard/DateRangeFilter.vue';

export default {
  name: 'DashboardPage',
  components: {
    SummaryCard,
    DataChart,
    DateRangeFilter,
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
        totalEmployees: 0, // Added totalEmployees
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
      monthlySalaryData: { 
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
    };
  },
  methods: {
    handleDateRangeChange(range) {
      this.selectedDateRange = range;
      this.fetchDashboardData();
    },
    fetchDashboardData() {
      console.log('Fetching data for:', this.selectedDateRange.startDate, 'to', this.selectedDateRange.endDate);

      this.summaryData.presentToday = Math.floor(Math.random() * 50) + 50;
      this.summaryData.absentToday = Math.floor(Math.random() * 10) + 1;
      this.summaryData.totalEmployees = Math.floor(Math.random() * 100) + 50; // Mock total employees

      const dailyLabels = [];
      const dailyPresent = [];
      const dailyAbsent = [];
      let currentDate = new Date(this.selectedDateRange.startDate);
      const endDate = new Date(this.selectedDateRange.endDate);
      
      if (currentDate > endDate) {
        this.dailyPresenceData = { labels: [], datasets: [
          { label: 'Present', backgroundColor: '#36A2EB', borderColor: '#36A2EB', data: [] },
          { label: 'Absent', backgroundColor: '#FF6384', borderColor: '#FF6384', data: [] },
        ] };
        this.monthlySalaryData = { labels: [], datasets: [
          { label: 'Total Salary', backgroundColor: '#4BC0C0', borderColor: '#4BC0C0', data: [], type: 'line', fill: false, tension: 0.1 },
        ] };
        return;
      }

      while(currentDate <= endDate) {
        dailyLabels.push(currentDate.toLocaleDateString('en-CA'));
        dailyPresent.push(Math.floor(Math.random() * 20) + 70);
        dailyAbsent.push(Math.floor(Math.random() * 5) + 1);
        currentDate.setDate(currentDate.getDate() + 1);
        if (dailyLabels.length > 365) break; 
      }
      this.dailyPresenceData = {
        labels: dailyLabels,
        datasets: [
          { label: 'Present', backgroundColor: '#36A2EB', borderColor: '#36A2EB', data: dailyPresent },
          { label: 'Absent', backgroundColor: '#FF6384', borderColor: '#FF6384', data: dailyAbsent },
        ],
      };

      const monthlyLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const numMonths = Math.min(12, Math.max(1, Math.ceil(dailyLabels.length / 30)));
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
  },
  created() {
    this.fetchDashboardData();
  },
};
</script>

<style scoped>
.dashboard-page {
  padding: 25px;
  background-color: #f0f2f5; /* Light grey background */
  min-height: calc(100vh - 70px); /* Adjust 70px based on your header height */
}

.page-header {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #dee2e6;
}

.page-title {
  color: #1a202c; /* Darker blue/charcoal */
  margin: 0;
  font-size: 1.85rem;
  font-weight: 600;
}

.summary-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); /* Responsive grid */
  gap: 20px;
  margin-bottom: 30px;
}

.charts-section {
  display: grid;
  grid-template-columns: 1fr; /* Default to single column */
  gap: 25px;
}

.chart-wrapper {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .summary-section {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

@media (min-width: 992px) {
  .charts-section {
    grid-template-columns: repeat(2, 1fr); /* Two columns for charts on larger screens */
  }
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .page-title {
    margin-bottom: 15px;
  }
  .dashboard-page {
    padding: 15px;
  }
  .summary-section {
    gap: 15px;
  }
  .charts-section {
    gap: 15px;
  }
  .chart-wrapper {
    padding: 15px;
  }
}
</style>
