<template>
  <div class="salary-table-container">
    <table v-if="salaries.length > 0">
      <thead>
        <tr>
          <th>Emp ID</th>
          <th>Fullname</th>
          <th>Salary</th>
          <th>Total Attendance</th>
          <th>Absent</th>
          <th>Present</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="salary in salaries" :key="salary.employee_id">
          <td>{{ salary.emp_id }}</td>
          <td>{{ salary.fullname }}</td>
          <td>{{ formatRupiah(salary.salary) }}</td>
          <td>{{ salary.total_attendance }}</td>
          <td>{{ salary.absent }}</td>
          <td>{{ salary.present }}</td>
        </tr>
      </tbody>
    </table>
    <p v-else-if="!isLoading && salaries.length === 0">No salary data available for the selected month.</p>
    <p v-if="isLoading">Loading salary data...</p>
    <PaginationControls
      v-if="salaries.length > 0 && pagination.total_page > 1"
      :currentPage="pagination.page"
      :totalPages="pagination.total_page"
      @page-changed="onPageChange"
    />
  </div>
</template>

<script>
import PaginationControls from '../common/PaginationControls.vue';

export default {
  name: 'SalaryTable',
  components: {
    PaginationControls,
  },
  props: {
    salaries: {
      type: Array,
      required: true,
    },
    pagination: {
      type: Object,
      required: true,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    onPageChange(page) {
      this.$emit('page-changed', page);
    },
    formatRupiah(value) {
      if (typeof value !== 'number') {
        return value; // Or return a default string like 'N/A' or '-'
      }
      return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0, // Ensure no decimal places for Rupiah
      }).format(value);
    },
  },
};
</script>

<style scoped>
.salary-table-container {
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

thead {
  background-color: #007bff;
  color: white;
}

th, td {
  color: black;
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #e9ecef;
}

p {
  text-align: center;
  color: #555;
}
</style>
