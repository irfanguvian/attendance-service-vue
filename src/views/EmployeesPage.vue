<template>
  <div class="employees-page">
    <div class="page-header">
      <h1 class="page-title">Employees Management</h1>
    </div>

    <EmployeeTable 
      :employees="employees"
      @edit-employee="openEditModal"
      @delete-employee="handleDeleteEmployee"
    />

    <EmployeeModal 
      :visible="showModal"
      :employeeData="selectedEmployee"
      @close="closeModal"
      @save-employee="handleSaveEmployee"
    />

  </div>
</template>

<script>
import EmployeeTable from '@/components/employees/EmployeeTable.vue';
import EmployeeModal from '@/components/employees/EmployeeModal.vue';
// import { useEmployeeStore } from '@/stores/employeeStore'; // Assuming a Pinia store

export default {
  name: 'EmployeesPage',
  components: {
    EmployeeTable,
    EmployeeModal,
  },
  data() {
    return {
      showModal: false,
      selectedEmployee: null, // Used for editing
      employees: [], // Mock data, will be replaced by Pinia store later
      nextId: 0, // Mock ID counter
    };
  },
  // setup() {
  //   const employeeStore = useEmployeeStore();
  //   return { employeeStore };
  // },
  methods: {
    openEditModal(employee) {
      this.selectedEmployee = { ...employee }; // Pass a copy to avoid direct mutation
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
      this.selectedEmployee = null;
    },
    handleSaveEmployee(employeeData) {
      if (employeeData.id) {
        // Edit existing employee (mock)
        const index = this.employees.findIndex(emp => emp.id === employeeData.id);
        if (index !== -1) {
          this.employees.splice(index, 1, employeeData);
        }
      } else {
        // Add new employee (mock)
        employeeData.id = this.nextId++; // Assign a mock ID
        this.employees.push(employeeData);
      }
      // In a real app, you'd call a Pinia store action here
      // e.g., this.employeeStore.saveEmployee(employeeData);
      console.log('Saved employee:', employeeData);
      this.closeModal();
    },
    handleDeleteEmployee(employeeId) {
      if (confirm('Are you sure you want to delete this employee?')) {
        // Mock delete
        this.employees = this.employees.filter(emp => emp.id !== employeeId);
        // In a real app, call Pinia store action
        // e.g., this.employeeStore.deleteEmployee(employeeId);
        console.log('Deleted employee ID:', employeeId);
      }
    },
    loadMockEmployees() {
      // Simulate fetching from a store or API
      this.employees = [
        { id: 1, name: 'Alice Wonderland', position: 'Frontend Developer', email: 'alice@example.com', phone: '123-456-7890' },
        { id: 2, name: 'Bob The Builder', position: 'Backend Developer', email: 'bob@example.com', phone: '234-567-8901' },
        { id: 3, name: 'Charlie Brown', position: 'UI/UX Designer', email: 'charlie@example.com', phone: '345-678-9012' },
      ];
    }
  },
  created() {
    this.loadMockEmployees();
    // In a real app, you might fetch initial data from a Pinia store
    // e.g., this.employeeStore.fetchEmployees();
  },
};
</script>

<style scoped>
.employees-page {
  padding: 1.5rem; /* Consistent padding */
  background-color: #f8f9fa; /* Use CSS var or fallback */
  min-height: calc(100vh - 60px); /* Adjust 60px based on actual header height */
  box-sizing: border-box;
}

.page-header {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping on small screens */
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem; /* Space between title and button if they wrap */
}

.page-title {
  color: #2c3e50; /* Use CSS var or fallback */
  margin: 0;
  font-size: 2rem;
  font-weight: 600;
}

.add-employee-btn {
  /* Using general .btn and .btn-primary styles that should be defined globally or in App.vue/main.css */
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 0.95rem;
}

.add-employee-btn .icon {
  font-size: 1.2em;
  line-height: 1;
}

/* Responsive adjustments for the page header */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  .page-title {
    font-size: 1.75rem;
    margin-bottom: 1rem; /* Add space below title when stacked */
  }
  .add-employee-btn {
    width: 100%; /* Make button full width on small screens */
    justify-content: center;
  }
}
</style>
