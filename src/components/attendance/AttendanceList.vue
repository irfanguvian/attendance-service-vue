<template>
  <div class="attendance-list-container">
    <h3 style="color: black;">Today's Attendance</h3>
    <div v-if="isLoading" class="loading-state">Loading attendance records...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <div v-else>
      <table v-if="attendanceRecords.length > 0" class="attendance-table">
        <thead>
          <tr>
            <th>Employee ID</th>
            <th>Clock-in Time</th>
            <th>Employee Name</th> <!-- Assuming Employee details might be available -->
            <th>Position</th> <!-- Assuming Employee details might be available -->
          </tr>
        </thead>
        <tbody>
          <!-- API response has attendance.EmployeeID and attendance.ClockIn -->
          <!-- For Employee Name and Position, we'd ideally have that data from the API -->
          <!-- If not, we might need another call or to adjust expectations -->
          <tr v-for="record in attendanceRecords" :key="record.ID">
            <td>{{ record.EmployeeID }}</td>
            <td>{{ formatClockInTime(record.ClockIn) }}</td>
            <td>{{ record.Employee ? record.Employee.name : 'N/A' }}</td> <!-- Placeholder for actual data -->
            <td>{{ record.Employee ? record.Employee.position : 'N/A' }}</td> <!-- Placeholder for actual data -->
          </tr>
        </tbody>
      </table>
      <div v-else class="no-records">No attendance records for today.</div>
      <PaginationControls
        v-if="totalPages > 1"
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-changed="handlePageChange"
      />
    </div>
  </div>
</template>

<script>
import attendanceService from '../../services/attendanceService';
import PaginationControls from '../common/PaginationControls.vue';
import { format } from 'date-fns';

export default {
  name: 'AttendanceList',
  components: {
    PaginationControls,
  },
  data() {
    return {
      attendanceRecords: [],
      isLoading: false,
      error: null,
      currentPage: 1,
      totalPages: 0,
      limit: 10, // Or get from a config/prop
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
    async fetchTodayAttendance() {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await attendanceService.listTodayAttendance(this.currentPage, this.limit);
        this.attendanceRecords = response.data.data.attendance; 
        this.totalPages = response.data.data.total_page;
        this.currentPage = response.data.data.page;
        // Add success toaster notification if records are fetched and there's no error
        // We might want to only show this on explicit refresh, not initial load,
        // but for now, let's add it for any successful fetch.
        // Consider if this is too noisy for pagination.
        // if (response.data.success) { // Assuming your API returns a success flag at this level
        //   this.$root.$emit('show-toaster', { message: response.data.message || 'Attendance records loaded.', type: 'success' });
        // }
      } catch (err) {
        console.error("Error fetching today's attendance:", err);
        const message = this.getErrorMessage(err, "Failed to load today's attendance.");
        this.error = message;
        this.showGlobalToast(message, 'error');
      }
      this.isLoading = false;
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.fetchTodayAttendance();
    },
    formatClockInTime(dateTimeString) {
      if (!dateTimeString) return 'N/A';
      try {
        // API returns: "2025-05-01T13:12:03Z"
        return format(new Date(dateTimeString), 'yyyy-MM-dd HH:mm:ss');
      } catch (e) {
        console.error('Error formatting date:', e);
        return dateTimeString; // fallback to original string
      }
    },
    refreshList() {
      this.currentPage = 1; // Reset to first page on refresh
      this.fetchTodayAttendance().then(() => {
        if (!this.error) {
          this.showGlobalToast('Attendance list refreshed.', 'success');
        }
      });
    }
  },
  created() {
    this.fetchTodayAttendance();
  },
  mounted() {
    // Listen for event from AttendanceForm to refresh the list
    // Assuming AttendanceForm and AttendanceList are siblings under AttendancePage
    // The event should be emitted from AttendancePage or use a global event bus / Vuex/Pinia for complex cases
    // For now, if they are direct children of AttendancePage, AttendancePage can handle the event.
    // If AttendanceForm emits to its parent (AttendancePage), then AttendancePage can call this.refreshList()
    // This component will expose refreshList() to be called by parent.
  },
  // beforeDestroy() {
    // Clean up listener if it were set up with $on a global bus or $root
  // }
};
</script>

<style scoped>
.attendance-list-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.loading-state,
.error-state,
.no-records {
  text-align: center;
  padding: 20px;
  color: #555;
}

.error-state {
  color: #d9534f;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 15px;
}

.attendance-table th,
.attendance-table td {
  color: black;
  border: 1px solid #ddd;
  padding: 10px;
  text-align: left;
}

.attendance-table th {
  background-color: #f2f2f2;
  font-weight: bold;
}

.attendance-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.attendance-table tbody tr:hover {
  background-color: #f1f1f1;
}
</style>
