<template>
  <div class="date-picker-container">
    <label :for="pickerId" class="picker-label">{{ label }}:</label>
    <input 
      type="date" 
      :id="pickerId"
      class="date-input"
      v-model="selectedDate"
      @change="handleDateChange"
      :max="maxSelectableDateComputed"
    />
  </div>
</template>

<script>
export default {
  name: 'MonthPicker',
  props: {
    label: {
      type: String,
      default: 'Select Date'
    }
  },
  data() {
    const today = new Date().toISOString().slice(0, 10);
    return {
      selectedDate: today, // YYYY-MM-DD format
    };
  },
  computed: {
    pickerId() {
      return `date-picker-${this._uid}`;
    },
    maxSelectableDateComputed() {
      const today = new Date();
      return today.toISOString().slice(0, 10);
    }
  },
  methods: {
    handleDateChange() {
      if (this.selectedDate) {
        const [year, month] = this.selectedDate.split('-');
        this.$emit('month-changed', `${year}-${month}`);
      } else {
        const today = new Date();
        const year = today.getFullYear();
        const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
        this.$emit('month-changed', `${year}-${currentMonth}`);
      }
    },
  },
  mounted() {
    this.handleDateChange(); 
  }
};
</script>

<style scoped>
.date-picker-container {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}

.picker-label {
  font-weight: 500;
  color: #2d3748;
  font-size: 0.9em;
  white-space: nowrap;
}

.date-input {
  padding: 9px 10px;
  border: 1px solid #cbd5e0;
  border-radius: 6px;
  color: #1a202c;
  font-size: 0.95em;
  background-color: #f8fafc;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  min-width: 150px;
}

.date-input:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.2);
  outline: none;
}

@media (max-width: 520px) {
  .date-picker-container {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .picker-label {
    margin-bottom: 3px;
    font-size: 0.85em;
  }
  .date-input {
    width: 100%;
    font-size: 0.9em;
  }
}
</style>
