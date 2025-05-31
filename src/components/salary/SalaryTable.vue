<template>
  <div class="salary-table-wrapper">
    <div class="salary-table-container">
      <table class="salary-table">
        <thead>
          <tr>
            <th>Emp. ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Base Salary</th>
            <th>Deductions</th>
            <th>Bonuses</th>
            <th>Net Salary</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="salaries.length === 0">
            <td colspan="7" class="no-data">
              <div class="no-data-content">
                <svg class="no-data-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span>No salary data available for the selected month.</span>
              </div>
            </td>
          </tr>
          <tr v-for="salaryEntry in paginatedSalaries" :key="salaryEntry.employeeId" class="salary-row">
            <td data-label="Emp. ID">{{ salaryEntry.employeeId }}</td>
            <td data-label="Name">{{ salaryEntry.employeeName }}</td>
            <td data-label="Position">{{ salaryEntry.position }}</td>
            <td data-label="Base Salary">{{ formatCurrency(salaryEntry.baseSalary) }}</td>
            <td data-label="Deductions" class="deductions">{{ formatCurrency(salaryEntry.deductions) }}</td>
            <td data-label="Bonuses" class="bonuses">{{ formatCurrency(salaryEntry.bonuses) }}</td>
            <td data-label="Net Salary" class="net-salary">{{ formatCurrency(calculateNetSalary(salaryEntry)) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="totalPages > 1" class="pagination-controls">
      <button @click="prevPage" :disabled="currentPage === 1" class="pagination-button">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path></svg>
        Prev
      </button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button @click="nextPage" :disabled="currentPage === totalPages" class="pagination-button">
        Next
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path></svg>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SalaryTable',
  props: {
    salaries: {
      type: Array,
      required: true,
      default: () => [],
    },
    itemsPerPage: {
      type: Number,
      default: 10, // Default items per page
    }
  },
  data() {
    return {
      currentPage: 1,
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.salaries.length / this.itemsPerPage);
    },
    paginatedSalaries() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.salaries.slice(start, end);
    },
  },
  watch: {
    salaries() {
      this.currentPage = 1; // Reset to first page when salary data changes
    }
  },
  methods: {
    calculateNetSalary(salaryEntry) {
      return (salaryEntry.baseSalary || 0) - (salaryEntry.deductions || 0) + (salaryEntry.bonuses || 0);
    },
    formatCurrency(value) {
      if (typeof value !== 'number') {
        return 'N/A';
      }
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
};
</script>

<style scoped>
.salary-table-container {
  overflow-x: auto; /* Allows table to scroll horizontally on small screens */
  background-color: #ffffff;
  border-radius: 8px;
}

.salary-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}

.salary-table th,
.salary-table td {
  border-bottom: 1px solid #e2e8f0; /* Lighter border, only bottom */
  padding: 14px 12px; /* Adjusted padding */
  text-align: left;
  color: #4a5568; /* Medium grey text */
  white-space: nowrap; /* Prevent text wrapping in cells */
}

.salary-table th {
  background-color: #f8fafc; /* Very light grey for header */
  color: #2d3748; /* Darker grey for header text */
  font-weight: 600; /* Bolder header text */
  text-transform: uppercase;
  font-size: 0.8em;
  letter-spacing: 0.05em;
  border-top: 1px solid #e2e8f0;
}

.salary-row:hover {
  background-color: #f7fafc; /* Subtle hover effect */
}

.deductions {
  color: #e53e3e; /* Red for deductions */
}

.bonuses {
  color: #38a169; /* Green for bonuses */
}

.net-salary {
  font-weight: 600;
  color: #1a202c;
}

.no-data {
  text-align: center;
  padding: 40px 20px;
  color: #718096; /* Softer grey for no-data message */
  font-style: italic;
}

.no-data-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.no-data-icon {
  width: 48px;
  height: 48px;
  margin-bottom: 12px;
  color: #a0aec0; /* Lighter icon color */
}

/* Pagination Styles */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  margin-top: 20px;
  border-top: 1px solid #e2e8f0;
}

.pagination-button {
  background-color: #ffffff;
  color: #3182ce; /* Blue */
  border: 1px solid #3182ce;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.9em;
}

.pagination-button:hover:not(:disabled) {
  background-color: #3182ce;
  color: #ffffff;
}

.pagination-button:disabled {
  color: #a0aec0; /* Light grey for disabled text */
  border-color: #e2e8f0; /* Light grey border for disabled */
  cursor: not-allowed;
}

.pagination-button svg {
  width: 18px;
  height: 18px;
}

.page-info {
  color: #4a5568;
  font-size: 0.9em;
}

/* Responsive Table Styles */
@media (max-width: 768px) {
  .salary-table thead {
    display: none; /* Hide table header on small screens */
  }

  .salary-table tr {
    display: block;
    margin-bottom: 15px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    background-color: #ffffff;
  }

  .salary-table td {
    display: flex; /* Use flex for better alignment */
    justify-content: space-between; /* Align label and value */
    align-items: center;
    text-align: right; /* Align value to the right */
    padding: 10px 12px;
    border-bottom: 1px dashed #edf2f7; /* Lighter, dashed border between rows */
    white-space: normal; /* Allow text to wrap */
  }

  .salary-table td:last-child {
    border-bottom: none;
  }

  .salary-table td::before {
    content: attr(data-label);
    font-weight: bold;
    text-align: left; /* Align label to the left */
    margin-right: 10px; /* Space between label and value */
    color: #2d3748;
  }

  .pagination-controls {
    flex-direction: column;
    gap: 10px;
  }
  .pagination-button {
    width: 100%;
    justify-content: center;
  }
}
</style>
