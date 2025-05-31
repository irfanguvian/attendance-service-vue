<template>
  <div class="employee-table-container card">
    <div class="table-responsive">
      <table class="employee-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Position</th>
            <th>Email</th>
            <th>Phone</th>
            <th class="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="employees.length === 0">
            <td colspan="6" class="no-data">No employees found. Add one to get started!</td>
          </tr>
          <tr v-for="employee in employees" :key="employee.id" class="employee-row">
            <td data-label="ID">{{ employee.id }}</td>
            <td data-label="Name">{{ employee.name }}</td>
            <td data-label="Position">{{ employee.position }}</td>
            <td data-label="Email">{{ employee.email }}</td>
            <td data-label="Phone">{{ employee.phone }}</td>
            <td data-label="Actions" class="actions-cell">
              <button @click="$emit('edit-employee', employee)" class="btn btn-sm btn-icon btn-edit" title="Edit Employee">
                <span class="icon">&#9998;</span> <span class="btn-text">Edit</span>
              </button>
              <button @click="$emit('delete-employee', employee.id)" class="btn btn-sm btn-icon btn-delete" title="Delete Employee">
                <span class="icon">&#10006;</span> <span class="btn-text">Delete</span>
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeTable',
  props: {
    employees: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
};
</script>

<style scoped>
.card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.employee-table-container {
  margin-top: 1.5rem;
}

.table-responsive {
  overflow-x: auto; /* Essential for responsiveness */
  width: 100%;
}

.employee-table {
  width: 100%;
  border-collapse: collapse;
  /* margin-top: 1rem; Remove default margin, container handles spacing */
}

.employee-table th,
.employee-table td {
  border-bottom: 1px solid #e2e8f0; /* Softer borders */
  padding: 1rem 0.75rem; /* Adjusted padding */
  text-align: left;
  color: #333;
  vertical-align: middle;
}

.employee-table th {
  background-color: #f8f9fa; /* Lighter header */
  color: #2c3e50;
  font-weight: 600; /* Bolder header text */
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-top: 1px solid #e2e8f0;
}

.employee-table tr.employee-row:hover {
  background-color: #f1f3f5 /* Subtle hover */
}

.actions-header {
  text-align: right;
}

.actions-cell {
  text-align: right;
  white-space: nowrap; /* Prevent buttons from wrapping */
}

.btn {
  /* General button styles - should be defined globally or in App.vue/main.css */
  /* For this component, we'll add some specifics if not globally available */
  padding: 0.5rem 0.875rem;
  margin-right: 0.5rem;
  border: 1px solid transparent;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  line-height: 1.5;
  transition: all 0.2s ease-in-out;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.btn:last-child {
  margin-right: 0;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.8rem;
}

.btn-icon .icon {
  font-size: 1.1em;
}

.btn-edit {
  color: #ffffff;
  background-color: var(--vt-c-indigo, #2c3e50); /* Using a theme color */
  border-color: var(--vt-c-indigo, #2c3e50);
}
.btn-edit:hover {
  background-color: #3e5269;
  border-color: #3e5269;
}

.btn-delete {
  color: #ffffff;
  background-color: #e74c3c; /* Red */
  border-color: #e74c3c;
}
.btn-delete:hover {
  background-color: #c0392b;
  border-color: #c0392b;
}

.no-data {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-style: italic;
}

/* Responsive Table: Stacked layout for small screens */
@media (max-width: 768px) {
  .employee-table thead {
    display: none; /* Hide table headers */
  }
  .employee-table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  }
  .employee-table td {
    display: flex; /* Use flex for label and value alignment */
    justify-content: space-between; /* Align label and value */
    align-items: center;
    padding: 0.75rem 1rem;
    text-align: right; /* Align value to the right */
    border-bottom: 1px solid var(--color-border, #e9ecef); /* Separator for stacked items */
  }
  .employee-table td:last-child {
    border-bottom: none;
  }
  .employee-table td::before {
    content: attr(data-label); /* Use data-label for pseudo-header */
    font-weight: bold;
    text-align: left; /* Align pseudo-header to the left */
    margin-right: 1rem;
    color: var(--color-heading, #2c3e50);
  }
  .actions-cell {
    text-align: center; /* Center buttons in stacked view */
    padding-top: 0.5rem;
    padding-bottom: 1rem;
    /* display: block; */ /* Ensure it takes full width for centering buttons */
  }

  .actions-cell .btn {
    width: calc(50% - 0.5rem); /* Make buttons take half width with a small gap */
    justify-content: center;
    margin-bottom: 0.5rem; /* Add margin for buttons if they wrap */
  }

}

@media (max-width: 480px) {
  .actions-cell .btn .btn-text {
     display: none; /* Hide button text, show only icons */
  }
  .actions-cell .btn {
    padding: 0.5rem;
    width: auto; /* Allow buttons to size based on icon */
    min-width: 40px; /* Ensure a minimum tap area */
  }
  .btn-icon .icon {
    font-size: 1.3em;
  }
  .actions-cell {
    display: flex; /* Use flex to arrange buttons in a row */
    justify-content: flex-end; /* Align buttons to the right */
    gap: 0.5rem; /* Add gap between buttons */
  }
  .actions-cell::before {
    flex-grow: 1; /* Allow label to take available space */
    text-align: left;
  }
}
</style>
