<template>
  <div class="attendance-form-container">
    <form @submit.prevent="submitAttendance" class="attendance-form">
      <h3 class="form-title">Record Attendance</h3>
      <div class="form-group">
        <label for="employee">Employee:</label>
        <select id="employee" v-model="selectedEmployeeId" required class="form-control">
          <option disabled value="">Please select an employee</option>
          <option v-for="employee in employees" :key="employee.id" :value="employee.id">
            {{ employee.name }} ({{ employee.position }})
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="attendanceDate">Date:</label>
        <input type="date" id="attendanceDate" v-model="attendanceDate" required class="form-control" />
      </div>

      <div class="form-group">
        <label>Status:</label>
        <div class="status-options">
          <label v-for="statusOption in attendanceStatuses" :key="statusOption.value" class="radio-label">
            <input type="radio" :value="statusOption.value" v-model="selectedStatus" name="attendanceStatus" required />
            <span class="status-text">{{ statusOption.label }}</span>
          </label>
        </div>
      </div>
      
      <div class="form-group" v-if="selectedStatus === 'Late' || selectedStatus === 'Absent' || selectedStatus === 'On Leave'">
        <label for="remarks">Remarks <span v-if="selectedStatus === 'Late'">(e.g., reason for lateness)</span>:</label>
        <textarea id="remarks" v-model="remarks" placeholder="Optional remarks" class="form-control" rows="3"></textarea>
      </div>

      <button type="submit" class="btn btn-primary submit-btn">Record Attendance</button>
    </form>
  </div>
</template>

<script>
export default {
  name: 'AttendanceForm',
  props: {
    employees: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data() {
    return {
      selectedEmployeeId: '',
      attendanceDate: new Date().toISOString().slice(0, 10), // Default to today
      selectedStatus: 'Present', // Default status
      remarks: '',
      attendanceStatuses: [
        { label: 'Present', value: 'Present' },
        { label: 'Absent', value: 'Absent' },
        { label: 'Late', value: 'Late' },
        { label: 'On Leave', value: 'On Leave' },
      ],
    };
  },
  methods: {
    submitAttendance() {
      if (!this.selectedEmployeeId) {
        alert('Please select an employee.');
        return;
      }
      const attendanceRecord = {
        employeeId: this.selectedEmployeeId,
        employeeName: this.employees.find(e => e.id === this.selectedEmployeeId)?.name || 'N/A',
        date: this.attendanceDate,
        status: this.selectedStatus,
        remarks: (this.selectedStatus === 'Late' || this.selectedStatus === 'Absent' || this.selectedStatus === 'On Leave') ? this.remarks : ''
      };
      this.$emit('save-attendance', attendanceRecord);
      // Reset form (optional, could be done by parent)
      // this.selectedEmployeeId = '';
      // this.selectedStatus = 'Present';
      // this.remarks = '';
      // this.attendanceDate = new Date().toISOString().slice(0,10);
    },
  },
};
</script>

<style scoped>
/* .attendance-form-container is now styled by .card in parent */

.form-title {
  color: #2c3e50; /* Dark Blue */
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #34495e; /* Slightly lighter blue-grey */
  font-size: 0.9rem;
}

.form-control {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #bdc3c7; /* Light grey border */
  border-radius: 6px;
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-control:focus {
  border-color: #3498db; /* Blue focus */
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
  outline: none;
}

.status-options {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping for multiple options */
  gap: 0.75rem; /* Space between radio buttons */
}

.radio-label {
  display: flex;
  align-items: center;
  font-weight: normal;
  color: #333;
  cursor: pointer;
  padding: 0.5rem 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.radio-label:hover {
  background-color: #f0f0f0;
}

.radio-label input[type="radio"] {
  margin-right: 0.5rem;
  accent-color: #3498db; /* Blue for radio button */
  transform: scale(1.1);
}

.radio-label input[type="radio"]:checked + .status-text {
  font-weight: 500;
  color: #3498db;
}

.radio-label.selected {
    border-color: #3498db;
    background-color: #eaf5fc;
}

.submit-btn {
  /* Assuming .btn and .btn-primary are defined globally or in App.vue */
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  width: 100%;
  margin-top: 0.5rem;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .form-title {
    font-size: 1.25rem;
  }
  .status-options {
    flex-direction: column; /* Stack radio buttons on very small screens */
    align-items: flex-start;
  }
  .radio-label {
    width: 100%; /* Make labels full width */
  }
}
</style>
