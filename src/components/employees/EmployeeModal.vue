<template>
  <div class="modal-overlay" v-if="visible" @click.self="closeModal">
    <div class="modal-content">
      <h3 class="modal-title">{{ title }}</h3>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <label for="fullname">Full Name:</label>
          <input type="text" id="fullname" v-model="form.fullname" :class="{ 'input-error': errors.fullname }" required placeholder="Enter full name"/>
          <span v-if="errors.fullname" class="error-message">{{ errors.fullname }}</span>
        </div>
        <!-- Add other fields here if needed for create/update -->
        <div class="modal-actions">
          <button type="submit" class="btn-save">Save</button>
          <button type="button" @click="closeModal" class="btn-cancel">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    employeeData: {
      type: Object,
      default: null, 
    },
    title: {
      type: String,
      default: 'Employee Form'
    }
  },
  data() {
    return {
      form: {
        employee_id: null, // For updates
        fullname: '',
      },
      errors: { // Added for validation errors
        fullname: null,
      },
    };
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.clearErrors(); // Clear errors when modal becomes visible
        if (this.employeeData) {
          // Editing existing employee
          this.form.employee_id = this.employeeData.ID; // Assuming ID is the employee_id for update
          this.form.fullname = this.employeeData.Fullname;
        } else {
          // Adding new employee, reset form
          this.form.employee_id = null;
          this.form.fullname = '';
        }
      }
    },
    'form.fullname'() { // Clear fullname error on input change
      if (this.errors.fullname) {
        this.errors.fullname = null;
      }
    }
  },
  methods: {
    clearErrors() {
      this.errors.fullname = null;
      // Clear other errors here if you add more fields
    },
    validateForm() {
      this.clearErrors();
      let isValid = true;
      if (!this.form.fullname || this.form.fullname.trim() === '') {
        this.errors.fullname = 'Full name is required.';
        isValid = false;
      }
      // Add other field validations here if needed
      return isValid;
    },
    closeModal() {
      this.$emit('update:visible', false);
    },
    submitForm() {
      if (!this.validateForm()) {
        return; // Prevent submission if validation fails
      }
      const payload = { 
        fullname: this.form.fullname.trim() // Ensure to trim whitespace
      };
      // Only add employee_id if it exists (i.e., for updates)
      if (this.form.employee_id) {
        payload.employee_id = this.form.employee_id;
      }
      this.$emit('save', payload);
    },
  },
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.65); /* Slightly darker overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: #fff;
  padding: 30px 35px; /* Increased padding */
  border-radius: 10px; /* Softer radius */
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15); /* Enhanced shadow */
  width: 100%;
  max-width: 550px; /* Slightly wider modal */
  animation: slide-down 0.3s ease-out;
}

@keyframes slide-down {
  from {
    transform: translateY(-40px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-title {
  margin-top: 0;
  margin-bottom: 25px; /* Increased margin */
  font-size: 1.6rem; /* Slightly larger title */
  color: #343a40; /* Darker title color */
  text-align: center;
  font-weight: 600;
}

.form-group {
  margin-bottom: 20px; /* Increased margin */
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #495057; /* Darker label color */
  font-size: 0.95rem;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 12px 15px; /* Adjusted padding */
  border: 1px solid #ced4da; /* Softer border */
  border-radius: 6px; /* Softer input radius */
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.form-group input[type="text"]:focus {
  border-color: #007bff; /* Standard blue focus */
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: none;
}

.form-group input[type="text"].input-error {
  border-color: #dc3545; /* Bootstrap danger red */
}

.form-group input[type="text"].input-error:focus {
  border-color: #dc3545;
  box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
}

.error-message {
  display: block;
  color: #dc3545; /* Bootstrap danger red */
  font-size: 0.875rem;
  margin-top: 6px; /* Adjusted margin */
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px; /* Increased gap */
  margin-top: 30px; /* Increased margin */
}

.btn-save, .btn-cancel {
  padding: 10px 22px; /* Adjusted padding */
  border: none;
  border-radius: 6px; /* Softer button radius */
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease, box-shadow 0.15s ease;
}
.btn-save:hover, .btn-cancel:hover {
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.btn-save {
  background-color: #28a745; /* Green */
  color: white;
}
.btn-save:hover {
  background-color: #218838;
}

.btn-cancel {
  background-color: #6c757d; /* Grey */
  color: white;
}
.btn-cancel:hover {
  background-color: #5a6268;
}
</style>
