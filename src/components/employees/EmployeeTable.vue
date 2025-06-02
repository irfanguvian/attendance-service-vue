<template>
  <div class="employee-table-container">
    <button @click="showAddModal = true" class="add-employee-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-circle-fill" viewBox="0 0 16 16" style="margin-right: 8px;">
        <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3v-3z"/>
      </svg>
      Add Employee
    </button>
    <EmployeeModal 
      :visible.sync="showAddModal" 
      @save="handleAddEmployee"
      title="Add New Employee"
    />
    <EmployeeModal 
      :visible.sync="showEditModal" 
      :employeeData="selectedEmployee" 
      @save="handleUpdateEmployee"
      title="Edit Employee"
    />

    <div v-if="isLoading" class="loading-indicator">Loading employees...</div>
    <div v-if="error" class="error-message">{{ error }}</div>

    <div v-if="!isLoading && !error && employees.length === 0" class="no-employees">
      No employees found.
    </div>

    <table v-if="!isLoading && employees.length > 0" class="employee-table">
      <thead>
        <tr>
          <th>Employee ID</th>
          <th>Full Name</th>
          <th>Created At</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="employee in employees" :key="employee.ID">
          <td>{{ employee.EmpID }}</td>
          <td>{{ employee.Fullname }}</td>
          <td>{{ formatDate(employee.CreatedAt) }}</td>
          <td>
            <button @click="editEmployee(employee)" class="action-btn edit-btn">Edit</button>
            <button @click="confirmDelete(employee)" class="action-btn delete-btn">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>

    <PaginationControls
      v-if="totalPages > 0" 
      :current-page="currentPage"
      :total-pages="totalPages"
      @page-changed="changePage"
    />
  </div>
</template>

<script>
import EmployeeModal from './EmployeeModal.vue';
import employeeService from '@/services/employeeService';
import PaginationControls from '@/components/common/PaginationControls.vue'; // Import PaginationControls

export default {
  name: 'EmployeeTable',
  components: {
    EmployeeModal,
    PaginationControls, // Register PaginationControls
  },
  data() {
    return {
      employees: [],
      showAddModal: false,
      showEditModal: false,
      selectedEmployee: null,
      isLoading: false,
      error: null, // This is for general table loading error, not CRUD operation errors shown in toasts
      currentPage: 1,
      totalPages: 0,
      limit: 10, 
    };
  },
  methods: {
    showGlobalToast(message, type) {
      this.$root.$emit('show-toast', { message, type });
    },
    getErrorMessage(err, defaultMessage) {
      if (err && err.response && err.response.data && err.response.data.message) {
        return err.response.data.message;
      }
      if (err && err.message) {
        return err.message;
      }
      return defaultMessage;
    },
    async fetchEmployees() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await employeeService.listEmployees(this.currentPage, this.limit);
        if (response.data.success) {
          this.employees = response.data.data.employees || []; // Ensure employees is an array
          this.totalPages = response.data.data.total_page || 0;
          this.currentPage = response.data.data.page || 1;
        } else {
          const message = response.data.message || 'Failed to load employees.';
          this.error = message; // Set table-level error
          this.showGlobalToast(message, 'error');
          this.employees = []; // Ensure employees is an array on failure
          this.totalPages = 0;
        }
      } catch (err) {
        const message = this.getErrorMessage(err, 'An error occurred while fetching employees.');
        this.error = message; // Set table-level error
        this.showGlobalToast(message, 'error');
        this.employees = []; 
        this.totalPages = 0;
      }
      this.isLoading = false;
    },
    async handleAddEmployee(employeeData) {
      try {
        const response = await employeeService.createEmployee(employeeData);
        if (response.data.success) {
          this.showGlobalToast(response.data.message || 'Employee created successfully!', 'success');
          this.fetchEmployees(); 
          this.showAddModal = false;
        } else {
          this.showGlobalToast(response.data.message || 'Failed to create employee.', 'error');
        }
      } catch (err) {
        const message = this.getErrorMessage(err, 'Error creating employee.');
        this.showGlobalToast(message, 'error');
      }
    },
    editEmployee(employee) {
      this.selectedEmployee = { ...employee }; // Pass a copy to avoid direct mutation
      this.showEditModal = true;
    },
    async handleUpdateEmployee(employeeData) {
      try {
        const response = await employeeService.updateEmployee(employeeData);
        if (response.data.success) {
          this.showGlobalToast(response.data.message || 'Employee updated successfully!', 'success');
          this.fetchEmployees(); 
          this.showEditModal = false;
          this.selectedEmployee = null;
        } else {
          this.showGlobalToast(response.data.message || 'Failed to update employee.', 'error');
        }
      } catch (err) {
        const message = this.getErrorMessage(err, 'Error updating employee.');
        this.showGlobalToast(message, 'error');
      }
    },
    confirmDelete(employee) {
      if (window.confirm(`Are you sure you want to delete ${employee.Fullname}?`)) {
        this.deleteEmployee(employee.ID);
      }
    },
    async deleteEmployee(employeeId) {
      try {
        const response = await employeeService.deleteEmployee(employeeId);
        if (response.data.success) {
          this.showGlobalToast(response.data.message || 'Employee deleted successfully!', 'success');
          if (this.employees.length === 1 && this.currentPage > 1) {
            this.currentPage--;
          }
          this.fetchEmployees(); 
        } else {
          this.showGlobalToast(response.data.message || 'Failed to delete employee.', 'error');
        }
      } catch (err) {
        const message = this.getErrorMessage(err, 'Error deleting employee.');
        this.showGlobalToast(message, 'error');
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    changePage(newPage) {
      if (newPage > 0 && newPage <= this.totalPages) {
        this.currentPage = newPage;
        this.fetchEmployees();
      }
    },
  },
  created() {
    this.fetchEmployees();
  },
};
</script>

<style scoped>
.add-employee-btn {
  background-color: #28a745; /* Green */
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  margin-bottom: 20px;
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
  display: inline-flex; /* Ensures icon and text align nicely */
  align-items: center; /* Vertical alignment for icon and text */
}
.add-employee-btn:hover {
  background-color: #218838; /* Darker green */
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.employee-table-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  background-color: #fff; /* Ensure table itself is white if container has different bg */
}

.employee-table th,
.employee-table td {
  padding: 12px 15px;
  text-align: left;
  color: #333;
  border-bottom: 1px solid #e0e0e0; /* Lighter border for rows */
}

.employee-table th {
  background-color: #f8f9fa; /* Light grey for header */
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.employee-table tbody tr:nth-child(even) {
  background-color: #f9f9f9; /* Zebra striping for readability */
}

.employee-table tbody tr:hover {
  background-color: #f1f1f1; /* Hover effect for rows */
}

.action-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.875rem;
  margin-right: 8px;
  transition: background-color 0.2s ease, transform 0.1s ease;
}
.action-btn:last-child {
  margin-right: 0;
}
.action-btn:hover {
  transform: translateY(-1px);
}

.edit-btn {
  background-color: #007bff; /* Blue for edit */
  color: white;
}
.edit-btn:hover {
  background-color: #0056b3;
}

.delete-btn {
  background-color: #dc3545; /* Red for delete */
  color: white;
}
.delete-btn:hover {
  background-color: #c82333;
}

.pagination-controls {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid #e0e0e0;
}

.pagination-controls button {
  background-color: #6c757d; /* Grey for pagination buttons */
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  margin: 0 5px;
  transition: background-color 0.2s ease;
}

.pagination-controls button:disabled {
  background-color: #adb5bd;
  cursor: not-allowed;
  opacity: 0.7;
}

.pagination-controls button:not(:disabled):hover {
  background-color: #5a6268;
}

.pagination-controls span {
  margin: 0 10px;
  font-size: 0.9rem;
  color: #495057;
}

.loading-indicator,
.error-message,
.no-employees {
  text-align: center;
  padding: 20px;
  font-size: 1.1rem;
  color: #555;
  background-color: #f8f9fa;
  border-radius: 6px;
  margin: 20px 0;
  border: 1px dashed #ccc;
}

.error-message {
  color: #dc3545; /* Red for error messages */
  background-color: #f8d7da; /* Light red background for error messages */
  border-color: #f5c6cb;
}

/* Adjustments for EmployeeModal consistency if needed, but modal styles are in its own file */
/* The modal uses green for save and grey for cancel, which is fine. */
/* The Add Employee button is green, Edit is blue, Delete is red. This provides good visual cues. */

</style>
