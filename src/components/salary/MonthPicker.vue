<template>
  <div class="month-picker-container">
    <label for="month-year" class="picker-label">{{ label }}:</label>
    <input 
      type="month" 
      id="month-year" 
      class="month-input"
      v-model="selectedMonthYear" 
      @change="emitMonthChange"
    />
  </div>
</template>

<script>
export default {
  name: 'MonthPicker',
  props: {
    label: {
      type: String,
      default: 'Select Month'
    }
  },
  data() {
    return {
      selectedMonthYear: this.getCurrentMonthYear(),
    };
  },
  methods: {
    getCurrentMonthYear() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0'); // JavaScript months are 0-indexed
      return `${year}-${month}`;
    },
    emitMonthChange() {
      if (this.selectedMonthYear) {
        const [year, month] = this.selectedMonthYear.split('-');
        this.$emit('month-selected', { year: parseInt(year), month: parseInt(month) });
      }
    },
  },
  mounted() {
    // Emit initial month selection
    this.emitMonthChange();
  },
};
</script>

<style scoped>
.month-picker-container {
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.picker-label {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.9em;
  white-space: nowrap;
}

.month-input {
  padding: 9px 10px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  color: #1a202c;
  font-size: 0.95em;
  background-color: #f8fafc;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  min-width: 150px;
}

.month-input:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
  outline: none;
}

@media (max-width: 520px) {
  .month-picker-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .picker-label {
    margin-bottom: 3px;
    font-size: 0.85em;
  }
  .month-input {
    width: 100%;
    font-size: 0.9em;
  }
}
</style>
