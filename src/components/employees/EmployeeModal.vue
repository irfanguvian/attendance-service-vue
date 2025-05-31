<template>
  <div class="modal-overlay" v-if="show" @click.self="closeModal">
    <div class="modal-content card">
      <div class="modal-header">
        <h3 class="modal-title">{{ isEditMode ? 'Edit Employee' : 'Add New Employee' }}</h3>
        <button @click="closeModal" class="close-button" title="Close modal">&#x2715;</button>
      </div>
      <form @submit.prevent="handleSubmit" class="modal-form">
        <div class="form-group">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="formData.name" required placeholder="e.g., John Doe" />
        </div>
        <div class="form-group">
          <label for="position">Position:</label>
          <input type="text" id="position" v-model="formData.position" required placeholder="e.g., Software Engineer" />
        </div>
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="formData.email" required placeholder="e.g., john.doe@example.com" />
        </div>
        <div class="form-group">
          <label for="phone">Phone:</label>
          <input type="tel" id="phone" v-model="formData.phone" placeholder="e.g., (123) 456-7890" />
        </div>
        <div class="form-actions">
          <button type="button" @click="closeModal" class="btn btn-secondary">Cancel</button>
          <button type="submit" class="btn btn-primary">{{ isEditMode ? 'Save Changes' : 'Add Employee' }}</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmployeeModal',
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    employeeData: {
      type: Object,
      default: null, // Null when adding, object when editing
    },
  },
  data() {
    return {
      formData: {
        id: null,
        name: '',
        position: '',
        email: '',
        phone: '',
      },
    };
  },
  computed: {
    isEditMode() {
      return !!this.employeeData;
    },
  },
  watch: {
    employeeData: {
      handler(newData) {
        if (newData) {
          this.formData = { ...newData }; // Populate form for editing
        } else {
          this.resetForm(); // Reset for adding new
        }
      },
      immediate: true, // Populate form if employeeData is passed initially
      deep: true
    },
    show(newVal) {
      if (newVal && this.employeeData) {
         this.formData = { ...this.employeeData };
      } else if (newVal && !this.employeeData) {
        this.resetForm();
      }
    }
  },
  methods: {
    closeModal() {
      this.$emit('close');
      this.resetForm();
    },
    handleSubmit() {
      this.$emit('save-employee', { ...this.formData });
      this.closeModal();
    },
    resetForm() {
      this.formData = {
        id: null,
        name: '',
        position: '',
        email: '',
        phone: '',
      };
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
  background-color: rgba(0, 0, 0, 0.65); /* Darker overlay */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem; /* Add padding for overlay to prevent content touching edges */
  box-sizing: border-box;
}

.modal-content.card {
  /* Inherits card styles if defined globally, or define here */
  background-color: #ffffff;
  padding: 0; /* Remove padding, header/form will handle it */
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 550px; /* Slightly wider modal */
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Ensures border-radius applies to children */
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--color-border, #e2e8f0);
  background-color: #f8f9fa;
}

.modal-title {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-heading, #2c3e50);
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--color-text-light-2, #7f8c8d);
  cursor: pointer;
  padding: 0.25rem;
  line-height: 1;
}
.close-button:hover {
  color: var(--color-heading, #2c3e50);
}

.modal-form {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Space between form groups */
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500; /* Medium weight */
  color: var(--color-text, #34495e);
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--color-border, #bdc3c7);
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-group input:focus {
  border-color: var(--vt-c-indigo, #4f46e5); /* Theme color focus */
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  outline: none;
}

.form-actions {
  margin-top: 1rem; /* Space above action buttons */
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem; /* Space between buttons */
}

/* General button styles - assuming .btn, .btn-primary, .btn-secondary are defined globally or in App.vue/main.css */
/* Add some specific styling if not available globally */
.btn {
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.btn-primary {
  background-color: var(--vt-c-indigo, #4f46e5);
  color: white;
  border: 1px solid var(--vt-c-indigo, #4f46e5);
}
.btn-primary:hover {
  background-color: #4338ca;
  border-color: #4338ca;
}

.btn-secondary {
  background-color: var(--color-background-mute, #e9ecef);
  color: var(--color-text, #333);
  border: 1px solid var(--color-border, #ced4da);
}
.btn-secondary:hover {
  background-color: #d3d9df;
  border-color: #adb5bd;
}

@media (max-width: 576px) {
  .modal-content.card {
    max-width: calc(100% - 2rem); /* Ensure some margin on small screens */
    margin: 1rem;
  }
  .modal-header {
    padding: 0.75rem 1rem;
  }
  .modal-title {
    font-size: 1.1rem;
  }
  .modal-form {
    padding: 1rem;
  }
  .form-group input {
    padding: 0.65rem 0.875rem;
    font-size: 0.95rem;
  }
  .form-actions {
    flex-direction: column-reverse; /* Stack buttons on small screens */
    gap: 0.5rem;
  }
  .form-actions .btn {
    width: 100%;
  }
}
</style>
