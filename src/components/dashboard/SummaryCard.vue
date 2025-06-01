<template>
  <div class="summary-card" :class="cardClass">
    <div class="card-content">
      <div class="icon-wrapper">
        <component :is="iconComponent" class="summary-icon" />
      </div>
      <div class="text-content">
        <h3 class="card-title">{{ title }}</h3>
        <p class="summary-value">{{ value }}</p>
        <p v-if="subtitle" class="card-subtitle">{{ subtitle }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import IconPresent from '@/components/icons/IconPresent.vue';
import IconAbsent from '@/components/icons/IconAbsent.vue';
import IconTotalEmployees from '@/components/icons/IconTotalEmployees.vue';

export default {
  name: 'SummaryCard',
  components: {
    IconPresent,
    IconAbsent,
    IconTotalEmployees,
  },
  props: {
    title: {
      type: String,
      required: true,
    },
    value: {
      type: [String, Number],
      required: true,
    },
    iconType: {
      type: String,
      default: 'present'
    },
    subtitle: {
      type: String,
      default: null
    }
  },
  computed: {
    iconComponent() {
      switch (this.iconType) {
        case 'present':
          return 'IconPresent';
        case 'absent':
          return 'IconAbsent';
        case 'totalEmployees':
          return 'IconTotalEmployees';
        default:
          return 'IconPresent';
      }
    },
    cardClass() {
      return `summary-card-${this.iconType}`;
    }
  }
};
</script>

<style scoped>
.summary-card {
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.07);
  display: flex;
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.summary-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.card-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.icon-wrapper {
  margin-right: 15px;
  padding: 12px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.summary-icon {
  width: 28px;
  height: 28px;
}

.text-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.card-title {
  margin-top: 0;
  margin-bottom: 5px;
  color: #4a5568;
  font-size: 0.95em;
  font-weight: 500;
}

.summary-value {
  font-size: 1.75em;
  font-weight: 700;
  color: #1a202c;
  line-height: 1.2;
  margin: 0;
}

.card-subtitle {
  margin: 4px 0 0 0;
  color: #718096;
  font-size: 0.85em;
  font-weight: 400;
}

.summary-card-present .icon-wrapper {
  background-color: rgba(54, 162, 235, 0.1);
}
.summary-card-present .summary-icon {
  color: #36A2EB;
}

.summary-card-absent .icon-wrapper {
  background-color: rgba(255, 99, 132, 0.1);
}
.summary-card-absent .summary-icon {
  color: #FF6384;
}

.summary-card-totalEmployees .icon-wrapper {
  background-color: rgba(75, 192, 192, 0.1);
}
.summary-card-totalEmployees .summary-icon {
  color: #4BC0C0;
}

@media (max-width: 480px) {
  .summary-card {
    padding: 15px;
  }
  .icon-wrapper {
    margin-right: 12px;
    padding: 10px;
  }
  .summary-icon {
    width: 24px;
    height: 24px;
  }
  .card-title {
    font-size: 0.9em;
  }
  .summary-value {
    font-size: 1.6em;
  }
}
</style>
