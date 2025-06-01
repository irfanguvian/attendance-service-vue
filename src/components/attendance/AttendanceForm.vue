<template>
  <div class="attendance-form-container">
    <h3 style="color: black;">Record Attendance</h3>
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="employee_id">EMP ID:</label>
        <input type="text" id="emp_id" v-model.number="formData.emp_id" required />
      </div>
      <div class="form-group">
        <label for="clock_in">Clock-in Time:</label>
        <input type="datetime-local" id="clock_in" v-model="formData.clock_in" required />
      </div>
      <button type="submit" class="btn-submit">Submit</button>
    </form>
  </div>
</template>

<script>
import attendanceService from '../../services/attendanceService';
import { formatISO } from 'date-fns'; // Using date-fns for robust ISO 8601 formatting

export default {
  name: 'AttendanceForm',
  data() {
    return {
      formData: {
        emp_id: "",
        clock_in: this.getCurrentDateTimeLocal(),
      },
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
    getCurrentDateTimeLocal() {
      const now = new Date();
      // Adjust for local timezone
      const timezoneOffset = now.getTimezoneOffset() * 60000; // in milliseconds
      const localISOTime = new Date(now - timezoneOffset).toISOString().slice(0, 16);
      return localISOTime;
    },
    async handleSubmit() {
      if (!this.formData.emp_id || !this.formData.clock_in) {
        this.showGlobalToast('Employee ID and Clock-in time are required.', 'error');
        return;
      }

      try {
        // Convert local datetime-local string to ISO 8601 format with timezone
        // The API expects: "2025-05-01T13:12:03+07:00"
        // datetime-local input gives "YYYY-MM-DDTHH:mm"
        const date = new Date(this.formData.clock_in);
        const isoString = formatISO(date); // date-fns handles timezone correctly based on system

        const payload = {
          emp_id: this.formData.emp_id.trim(),
          clock_in: isoString,
        };

        await attendanceService.createAttendance(payload);
        this.showGlobalToast('Attendance recorded successfully!', 'success');
        this.$emit('attendance-created'); // Emit event to refresh list
        // Reset form
        this.formData.emp_id = null;
        this.formData.clock_in = this.getCurrentDateTimeLocal();
      } catch (error) {
        console.error('Error creating attendance:', error);
        const errorMessage = this.getErrorMessage(error, 'Failed to record attendance.');
        this.showGlobalToast(errorMessage, 'error');
      }
    },
  },
  mounted() {
    // Ensure date-fns is available or install it
    // npm install date-fns
    // For this environment, we assume it's installed.
  }
};
</script>

<style scoped>
.attendance-form-container {
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
}

.form-group input {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-submit {
  padding: 10px 15px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn-submit:hover {
  background-color: #0056b3;
}
</style>
