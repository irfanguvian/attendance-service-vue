<template>
  <div class="attendance-page">
    <div class="page-header">
      <h1 class="page-title">Attendance Management</h1>
    </div>

    <div class="content-layout">
      <div class="form-section card">
        <AttendanceForm @attendance-created="handleAttendanceCreated" />
      </div>

      <div class="list-section card">
        <AttendanceList ref="attendanceListRef" />
      </div>
    </div>

  </div>
</template>

<script>
import AttendanceForm from '@/components/attendance/AttendanceForm.vue';
import AttendanceList from '@/components/attendance/AttendanceList.vue';

export default {
  name: 'AttendancePage',
  components: {
    AttendanceForm,
    AttendanceList,
  },
  methods: {
    handleAttendanceCreated() {
      // Call the refreshList method on the AttendanceList component
      if (this.$refs.attendanceListRef) {
        this.$refs.attendanceListRef.refreshList();
      }
    },
  },
};
</script>

<style scoped>
.attendance-page {
  padding: 1.5rem;
  background-color: #f0f4f8; /* Lighter blue-grey background */
  min-height: calc(100vh - 60px); /* Adjust based on actual header height */
  box-sizing: border-box;
}

.page-header {
  margin-bottom: 2rem;
}

.page-title {
  color: #2c3e50; /* Dark Blue */
  font-size: 2rem;
  font-weight: 600;
  margin: 0;
}

.content-layout {
  display: flex;
  flex-direction: column; /* Stack form and list by default */
  gap: 1.5rem;
}

.card {
  background-color: #ffffff;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.form-section,
.list-section {
  flex: 1; /* Allow them to grow */
}

/* Responsive adjustments */
@media (min-width: 992px) { /* Larger screens: form and list side-by-side */
  .content-layout {
    flex-direction: row; /* Side-by-side layout */
    align-items: flex-start; /* Align items to the top */
  }
  .form-section {
    flex: 0 0 400px; /* Fixed width for form, or use percentages */
    max-width: 400px;
  }
  .list-section {
    flex: 1; /* List takes remaining space */
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }
  .card {
    padding: 1rem;
  }
}
</style>
