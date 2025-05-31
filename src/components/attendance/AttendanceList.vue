<template>
  <div class="attendance-list-container">
    <h3 class="list-title">Attendance Records</h3>
    <!-- Add filters here if needed, e.g., date range, employee filter -->
    <div v-if="attendanceRecords.length === 0" class="no-records">
      No attendance records found. Try recording some attendance or adjusting filters.
    </div>
    <div class="table-responsive" v-else>
      <table class="attendance-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Employee Name</th>
            <th>Status</th>
            <th>Remarks</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="record in pagedAttendanceRecords" :key="record.id" class="record-row">
            <td data-label="Date">{{ formatDate(record.date) }}</td>
            <td data-label="Employee">{{ record.employeeName }}</td>
            <td data-label="Status">
              <span :class="['status-badge', getStatusClass(record.status)]">{{ record.status }}</span>
            </td>
            <td data-label="Remarks">{{ record.remarks || '-' }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="pagination-controls" v-if="totalPages > 1">
        <button @click="prevPage" :disabled="currentPage === 1" class="btn btn-sm">Previous</button>
        <span>Page {{ currentPage }} of {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" class="btn btn-sm">Next</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AttendanceList',
  props: {
    attendanceRecords: {
      type: Array,
      required: true,
      default: () => [],
    },
  },
  data() {
    return {
      currentPage: 1,
      itemsPerPage: 10, // Or make this a prop
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.attendanceRecords.length / this.itemsPerPage);
    },
    pagedAttendanceRecords() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.attendanceRecords.slice(start, end);
    }
  },
  methods: {
    getStatusClass(status) {
      // Return a class based on status for styling (e.g., color coding)
      switch (status) {
        case 'Present':
          return 'status-present';
        case 'Absent':
          return 'status-absent';
        case 'Late':
          return 'status-late';
        case 'On Leave':
          return 'status-on-leave';
        default:
          return '';
      }
    },
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    }
  },
  watch: {
    attendanceRecords() {
      // Reset to first page if records change (e.g., due to filtering in parent)
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
/* .attendance-list-container is now styled by .card in parent */

.list-title {
  color: #2c3e50; /* Dark Blue */
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.table-responsive {
  overflow-x: auto;
  width: 100%;
}

.attendance-table {
  width: 100%;
  border-collapse: collapse;
}

.attendance-table th,
.attendance-table td {
  border-bottom: 1px solid #e2e8f0; /* Softer borders */
  padding: 0.875rem 0.75rem; /* Adjusted padding */
  text-align: left;
  color: #333;
  vertical-align: middle;
}

.attendance-table th {
  background-color: #f8f9fa; /* Lighter header */
  color: #2c3e50;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-top: 1px solid #e2e8f0;
}

.attendance-table tr.record-row:hover {
  background-color: #f1f3f5; /* Subtle hover */
}

.no-records {
  text-align: center;
  padding: 2rem;
  color: #7f8c8d;
  font-style: italic;
  background-color: #f9fafb;
  border-radius: 8px;
}

.status-badge {
  padding: 0.25em 0.6em;
  border-radius: 12px; /* Pill shape */
  font-size: 0.8rem;
  font-weight: 500;
  text-transform: capitalize;
  color: #fff;
  display: inline-block;
  line-height: 1.2;
}

.status-present {
  background-color: #2ecc71; /* Green */
}
.status-absent {
  background-color: #e74c3c; /* Red */
}
.status-late {
  background-color: #f39c12; /* Orange */
}
.status-on-leave {
  background-color: #9b59b6; /* Purple */
}

.pagination-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #e2e8f0;
}

.pagination-controls .btn {
    /* Assuming .btn and .btn-sm are defined globally or in App.vue */
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
}

/* Responsive Table: Stacked layout for small screens */
@media (max-width: 768px) {
  .attendance-table thead {
    display: none; /* Hide table headers */
  }
  .attendance-table tr {
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
    background-color: #fff;
  }
  .attendance-table td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    text-align: right;
    border-bottom: 1px solid #e9ecef;
  }
  .attendance-table td:last-child {
    border-bottom: none;
  }
  .attendance-table td::before {
    content: attr(data-label);
    font-weight: bold;
    text-align: left;
    margin-right: 1rem;
    color: #2c3e50;
  }
  .status-badge {
    font-size: 0.75rem;
  }
  .pagination-controls {
    flex-direction: column;
    gap: 0.5rem;
  }
  .pagination-controls .btn {
    width: 100%;
  }
}
</style>
