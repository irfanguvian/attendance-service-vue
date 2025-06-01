<template>
  <div class="salary-page">
    <h2>Salary Menu</h2>
    <MonthPicker @month-selected="handleMonthSelected" />
    <SalaryTable 
      :salaries="salaries"
      :pagination="pagination"
      :isLoading="isLoading"
      @page-changed="handlePageChange"
    />
  </div>
</template>

<script>
import MonthPicker from '../components/salary/MonthPicker.vue';
import SalaryTable from '../components/salary/SalaryTable.vue';
import salaryService from '../services/salaryService';
import { format, startOfMonth, endOfMonth, set } from 'date-fns';

export default {
  name: 'SalaryPage',
  components: {
    MonthPicker,
    SalaryTable,
  },
  data() {
    return {
      salaries: [],
      pagination: {
        page: 1,
        limit: 10, // Default limit, adjust if necessary
        total: 0,
        total_page: 1,
      },
      selectedMonth: null, // { year, month }
      isLoading: false,
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
    async fetchSalaries() {
      if (!this.selectedMonth) return;
      this.isLoading = true;

      const { year, month } = this.selectedMonth;
      const dateInSelectedMonth = new Date(year, month - 1, 1);

      const firstDay = startOfMonth(dateInSelectedMonth);
      const lastDay = endOfMonth(dateInSelectedMonth);

      const formattedStartDate = format(set(firstDay, { hours: 0, minutes: 0, seconds: 0 }), "yyyy-MM-dd HH:mm:ss");
      const formattedEndDate = format(set(lastDay, { hours: 23, minutes: 59, seconds: 59 }), "yyyy-MM-dd HH:mm:ss");
      
      try {
        const serviceResponse = await salaryService.getSalaries(
          this.pagination.page,
          this.pagination.limit,
          formattedStartDate,
          formattedEndDate
        );
        // Adjusting data extraction: assumes serviceResponse is the API response body
        // and contains fields like 'data' (for the array), 'total', 'total_page', 'page'.
        this.salaries = serviceResponse.data.salary || []; 
        this.pagination.total = serviceResponse.data.total || 0;
        this.pagination.total_page = serviceResponse.data.total_page || 1;
        this.pagination.page = serviceResponse.data.page || 1;
        
      } catch (error) {
        console.error('Error fetching salaries:', error);
        this.showErrorToast(error.response?.data?.error || error.message || 'Failed to fetch salaries.');
        this.salaries = []; // Clear salaries on error
        this.pagination = { ...this.pagination, total: 0, total_page: 1, page: 1 }; // Reset pagination
      }
      this.isLoading = false;
    },
    handleMonthSelected(monthDetails) { // monthDetails = { year, month }
      this.selectedMonth = monthDetails;
      this.pagination.page = 1; // Reset to first page when month changes
      this.fetchSalaries();
    },
    handlePageChange(page) {
      this.pagination.page = page;
      this.fetchSalaries();
    },
  },
  mounted() {
    // The initial fetch is triggered when MonthPicker emits 'month-selected' on its mount.
  },
};
</script>

<style scoped>
.salary-page {
  padding: 20px;
  font-family: 'Arial', sans-serif; /* More common font stack */
  max-width: 1000px; /* Max width for better readability on large screens */
  margin: 0 auto; /* Center the page content */
}

.salary-page h2 {
  text-align: center;
  margin-bottom: 25px;
  color: #333;
  font-size: 1.8rem;
}
</style>
