<template>
  <div class="date-range-filter">
    <div class="filter-item">
      <label for="startDate" class="filter-label">From:</label>
      <input type="date" id="startDate" class="date-input" v-model="startDate" @change="emitDateChange" :max="endDate" />
    </div>
    <div class="filter-item">
      <label for="endDate" class="filter-label">To:</label>
      <input type="date" id="endDate" class="date-input" v-model="endDate" @change="emitDateChange" :min="startDate" :max="today" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateRangeFilter',
  data() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      startDate: today,
      endDate: today,
      today: today, // To restrict end date to today
    };
  },
  methods: {
    emitDateChange() {
      // Basic validation: if startDate is after endDate, set endDate to startDate
      if (this.startDate > this.endDate) {
        this.endDate = this.startDate;
      }
      this.$emit('date-range-changed', { 
        startDate: this.startDate, 
        endDate: this.endDate 
      });
    },
  },
  mounted() {
    this.emitDateChange();
  }
};
</script>

<style scoped>
.date-range-filter {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping on smaller screens */
  align-items: center;
  gap: 15px; /* Spacing between filter items */
  padding: 12px 15px;
  background-color: #ffffff;
  border-radius: 8px;
  /* margin-bottom: 20px; -- Controlled by parent */
  border: 1px solid #e2e8f0; /* Softer border */
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label { /* Changed from .date-range-filter label */
  font-weight: 500;
  color: #2d3748; /* Darker grey */
  font-size: 0.9em;
}

.date-input { /* Changed from .date-range-filter input[type="date"] */
  padding: 9px 10px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  color: #1a202c;
  font-size: 0.95em;
  background-color: #f8fafc;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  min-width: 130px; /* Ensure inputs have enough width */
}

.date-input:focus {
  border-color: #3182ce; /* Blue border on focus */
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
  outline: none;
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .date-range-filter {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  .filter-item {
    justify-content: space-between; /* Distribute label and input */
  }
  .date-input {
    flex-grow: 1; /* Allow input to take available space */
    min-width: 0; /* Reset min-width for stacking */
  }
}
</style>
