<template>
  <div class="attendance-page">
    <div class="page-header">
      <h1 class="page-title">Attendance Management</h1>
      <!-- Optional: Add a button here if needed, e.g., for bulk actions or reports -->
    </div>

    <div class="content-layout">
      <div class="form-section card">
        <AttendanceForm 
          :employees="employees"
          @save-attendance="handleSaveAttendance"
        />
      </div>

      <div class="list-section card">
        <AttendanceList 
          :attendanceRecords="attendanceRecords"
        />
      </div>
    </div>

  </div>
</template>

<script>
import AttendanceForm from '@/components/attendance/AttendanceForm.vue';
import AttendanceList from '@/components/attendance/AttendanceList.vue';
// import { useEmployeeStore } from '@/stores/employeeStore'; // For fetching employees
// import { useAttendanceStore } from '@/stores/attendanceStore'; // For managing attendance

export default {
  name: 'AttendancePage',
  components: {
    AttendanceForm,
    AttendanceList,
  },
  data() {
    return {
      employees: [], // Mock employee data
      attendanceRecords: [], // Mock attendance records
      // Mock IDs for employees, replace with actual data handling
      nextEmployeeId: 1,
      nextAttendanceRecordId: 1, 
    };
  },
  // setup() {
  //   const employeeStore = useEmployeeStore();
  //   const attendanceStore = useAttendanceStore();
  //   // Fetch employees if not already loaded
  //   if (employeeStore.employees.length === 0) {
  //     employeeStore.fetchEmployees();
  //   }
  //   // Fetch initial attendance records if needed
  //   // attendanceStore.fetchAttendanceRecords(); 
  //   return { employeeStore, attendanceStore };
  // },
  methods: {
    loadMockEmployees() {
      // In a real app, this would come from a Pinia store (employeeStore)
      this.employees = [
        { id: this.nextEmployeeId++, name: 'Alice Wonderland', position: 'Frontend Developer' },
        { id: this.nextEmployeeId++, name: 'Bob The Builder', position: 'Backend Developer' },
        { id: this.nextEmployeeId++, name: 'Charlie Brown', position: 'UI/UX Designer' },
        { id: this.nextEmployeeId++, name: 'Diana Prince', position: 'Project Manager' },
      ];
    },
    loadMockAttendanceRecords() {
        // Mock initial records, or fetch from store
        this.attendanceRecords = [
            {
                id: this.nextAttendanceRecordId++,
                employeeId: 1,
                employeeName: 'Alice Wonderland',
                date: '2025-05-30',
                status: 'Present',
                remarks: ''
            },
            {
                id: this.nextAttendanceRecordId++,
                employeeId: 2,
                employeeName: 'Bob The Builder',
                date: '2025-05-30',
                status: 'Absent',
                remarks: 'Sick leave'
            }
        ];
    },
    handleSaveAttendance(record) {
      // In a real app, this would call an action in a Pinia store (attendanceStore)
      // e.g., this.attendanceStore.addAttendanceRecord(record);
      const newRecord = {
        ...record,
        id: this.nextAttendanceRecordId++ // Assign a mock ID
      };
      this.attendanceRecords.unshift(newRecord); // Add to the beginning of the list
      console.log('Attendance Recorded:', newRecord);
      alert('Attendance recorded successfully!');
    },
  },
  created() {
    this.loadMockEmployees();
    this.loadMockAttendanceRecords();
    // Access store data if using Pinia
    // this.employees = this.employeeStore.employees;
    // this.attendanceRecords = this.attendanceStore.records;
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
