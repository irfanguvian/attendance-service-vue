<template>
  <div class="monthly-trend-card card">
    <h3 class="card-title">Monthly Performance Insights</h3>
    <div class="trend-details">
      <div class="detail-item">
        <span class="label">Total Salary Disbursed:</span>
        <span class="value">{{ trend.total_salary_disbursed | formatCurrency }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Avg. Attendance Rate:</span>
        <span class="value">{{ trend.avg_attendance_rate | formatPercentage }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Total Employees:</span>
        <span class="value">{{ trend.total_employees }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Most Present:</span>
        <span class="value employee-id">{{ trend.most_present_employee }}</span>
      </div>
      <div class="detail-item">
        <span class="label">Least Present:</span>
        <span class="value employee-id">{{ trend.least_present_employee }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MonthlyTrendCard',
  props: {
    trend: {
      type: Object,
      required: true,
    },
  },
  filters: {
    formatMonthYear(value) {
      if (!value) return '';
      const [year, month] = value.split('-');
      const date = new Date(year, month - 1);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    },
    formatCurrency(value) {
      if (typeof value !== 'number') {
        return value;
      }
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(value);
    },
    formatPercentage(value) {
      if (typeof value !== 'number') {
        return value;
      }
      return `${(value).toFixed(2)}%`;
    }
  }
};
</script>

<style scoped>
.monthly-trend-card {
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  padding: 20px;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.monthly-trend-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0,0,0,0.12);
}

.card-title {
  color: #1a202c;
  font-size: 1.3rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 18px;
  border-bottom: 1px solid #e2e8f0;
  padding-bottom: 10px;
}

.trend-details {
  display: grid;
  gap: 12px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #edf2f7;
  font-size: 0.95em;
}

.detail-item:last-child {
  border-bottom: none;
}

.label {
  color: #4a5568;
  font-weight: 500;
}

.value {
  color: #2d3748;
  font-weight: 600;
}

.employee-id {
  background-color: #e2e8f0;
  color: #2d3748;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.9em;
}
</style>
