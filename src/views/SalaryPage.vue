<template>
  <div class="salary-page">
    <div class="page-header">
      <h2 class="page-title">Salary Overview</h2>
      <MonthPicker @month-changed="handleMonthChange" />
    </div>

    <p v-if="selectedMonthDisplay" class="current-month-display">
      Displaying salaries for: <strong>{{ selectedMonthDisplay }}</strong>
    </p>

    <div class="table-container">
      <SalaryTable :salaries="salaryData" />
    </div>

  </div>
</template>

<script>
import MonthPicker from '@/components/salary/MonthPicker.vue';
import SalaryTable from '@/components/salary/SalaryTable.vue';
// import { useEmployeeStore } from '@/stores/employeeStore';
// import { useSalaryStore } from '@/stores/salaryStore'; // Or a service to fetch/calculate salaries

export default {
  name: 'SalaryPage',
  components: {
    MonthPicker,
    SalaryTable,
  },
  data() {
    return {
      selectedMonth: this.getCurrentMonthYear(), // YYYY-MM format
      salaryData: [], // To store salary data for the selected month
      // Mock employee data (in a real app, this would come from employeeStore)
      employees: [
        { id: 1, name: 'Alice Wonderland', position: 'Frontend Developer', baseSalary: 60000 },
        { id: 2, name: 'Bob The Builder', position: 'Backend Developer', baseSalary: 75000 },
        { id: 3, name: 'Charlie Brown', position: 'UI/UX Designer', baseSalary: 55000 },
        { id: 4, name: 'Diana Prince', position: 'Project Manager', baseSalary: 80000 },
      ],
    };
  },
  computed: {
    selectedMonthDisplay() {
      if (!this.selectedMonth) return '';
      const [year, month] = this.selectedMonth.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long' });
    }
  },
  // setup() {
  //   const employeeStore = useEmployeeStore();
  //   // const salaryStore = useSalaryStore();
  //   // if (employeeStore.employees.length === 0) { //   employeeStore.fetchEmployees(); // }
  //   return { employeeStore /*, salaryStore */ };
  // },
  methods: {
    getCurrentMonthYear() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      return `${year}-${month}`;
    },
    handleMonthChange(month) {
      this.selectedMonth = month;
      this.fetchSalaryData();
    },
    fetchSalaryData() {
      // Mock salary calculation. In a real app, this would involve:
      // 1. Fetching employee data (if not already available).
      // 2. Fetching attendance data for the selected month for each employee.
      // 3. Calculating deductions (e.g., for absences) and bonuses.
      // 4. Potentially calling a backend service or using a Pinia store action.
      console.log(`Fetching/calculating salary data for: ${this.selectedMonthDisplay}`);

      // For demonstration, generate mock salary data based on base salary and random deductions/bonuses
      this.salaryData = this.employees.map(emp => {
        const deductions = Math.floor(Math.random() * (emp.baseSalary / 12 * 0.1)); // Random deduction up to 10% of monthly
        const bonuses = Math.floor(Math.random() * (emp.baseSalary / 12 * 0.05)); // Random bonus up to 5% of monthly
        return {
          employeeId: emp.id,
          employeeName: emp.name,
          position: emp.position,
          baseSalary: emp.baseSalary / 12, // Monthly base salary
          deductions: deductions,
          bonuses: bonuses,
        };
      });
    },
  },
  created() {
    // Initial fetch for the default (current) month
    this.fetchSalaryData();
    // If using Pinia:
    // this.employees = this.employeeStore.employees;
    // this.fetchSalaryData(); // This would then use the store's employees
  },
};
</script>

<style scoped>
.salary-page {
  padding: 25px;
  background-color: #f0f2f5; /* Light grey background for the page */
  min-height: calc(100vh - 70px); /* Adjust 70px based on your header height */
}

.page-header {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  padding-bottom: 15px;
  border-bottom: 1px solid #dee2e6; /* Light border */
}

.page-title { /* Changed from .salary-page h2 */
  color: #1a202c; /* Darker blue/charcoal for heading */
  margin: 0;
  font-size: 1.75rem; /* Larger font size */
  font-weight: 600;
}

.current-month-display {
  margin-bottom: 20px;
  font-size: 1.1em;
  color: #4a5568; /* Medium grey for text */
  background-color: #ffffff;
  padding: 10px 15px;
  border-radius: 6px;
  display: inline-block;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.table-container {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    margin-bottom: 15px; /* Add space below title when stacked */
  }

  .salary-page {
    padding: 15px;
  }

  .table-container {
    padding: 15px;
  }
}
</style>
