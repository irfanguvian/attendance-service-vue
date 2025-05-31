<template>
  <div class="chart-container">
    <h4 class="chart-title">{{ title }}</h4>
    <canvas :id="chartId"></canvas>
  </div>
</template>

<script>
import Chart from 'chart.js/auto'; // Using Chart.js v3+ which is tree-shakeable

export default {
  name: 'DataChart',
  props: {
    chartId: {
      type: String,
      required: true,
      default: 'myChart'
    },
    title: {
      type: String,
      required: true,
    },
    chartData: {
      type: Object,
      required: true,
    },
    chartOptions: {
      type: Object,
      default: () => ({
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 12,
                family: "'Inter', sans-serif", // Consistent font
              },
              color: '#4A5568', // Legend text color
              padding: 15,
            }
          },
          tooltip: {
            backgroundColor: '#2D3748', // Tooltip background
            titleFont: {
              size: 14,
              family: "'Inter', sans-serif",
            },
            bodyFont: {
              size: 12,
              family: "'Inter', sans-serif",
            },
            padding: 10,
            cornerRadius: 4,
            displayColors: true, // Show color box in tooltip
          }
        },
        scales: {
          x: {
            grid: {
              display: false, // Hide X-axis grid lines
            },
            ticks: {
              font: {
                size: 11,
                family: "'Inter', sans-serif",
              },
              color: '#718096', // X-axis ticks color
            }
          },
          y: {
            grid: {
              color: '#E2E8F0', // Lighter Y-axis grid lines
              borderDash: [2, 4], // Dashed grid lines
            },
            ticks: {
              font: {
                size: 11,
                family: "'Inter', sans-serif",
              },
              color: '#718096', // Y-axis ticks color
              padding: 10,
            }
          }
        }
      }),
    },
  },
  data() {
    return {
      chartInstance: null,
    };
  },
  mounted() {
    this.renderChart();
  },
  watch: {
    chartData: {
      deep: true,
      handler() {
        this.renderChart();
      }
    }
  },
  methods: {
    renderChart() {
      if (!this.chartData || !this.chartData.labels || !this.chartData.datasets) {
        console.warn('Chart data is incomplete. Skipping render for chartId:', this.chartId);
        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
        // Optionally, display a message on the canvas
        const canvas = document.getElementById(this.chartId);
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = "16px 'Inter', sans-serif";
            ctx.fillStyle = '#718096';
            ctx.textAlign = 'center';
            ctx.fillText('No data to display', canvas.width / 2, canvas.height / 2);
        }
        return;
      }
      if (this.chartInstance) {
        this.chartInstance.destroy();
      }
      const ctx = document.getElementById(this.chartId);
      if (!ctx) {
        console.error('Canvas element not found for chartId:', this.chartId);
        return;
      }
      this.chartInstance = new Chart(ctx, {
        type: this.chartData.datasets && this.chartData.datasets.length > 0 && this.chartData.datasets[0].type ? this.chartData.datasets[0].type : 'bar',
        data: this.chartData,
        options: this.chartOptions,
      });
    },
  },
  beforeDestroy() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
    }
  },
};
</script>

<style scoped>
.chart-container {
  /* background-color: #ffffff; -- Handled by chart-wrapper in parent */
  /* padding: 20px; -- Handled by chart-wrapper in parent */
  /* border-radius: 8px; -- Handled by chart-wrapper in parent */
  /* box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); -- Handled by chart-wrapper in parent */
  /* margin: 20px 0; -- Handled by grid gap in parent */
  width: 100%;
  height: 350px; /* Default height, can be overridden by parent if needed */
}

.chart-title { /* Changed from .chart-container h4 */
  text-align: center;
  color: #2d3748; /* Darker grey for title */
  margin-bottom: 20px; /* Increased space below title */
  font-size: 1.15rem; /* Slightly larger title */
  font-weight: 600;
}

canvas {
  width: 100% !important;
  height: 100% !important;
}

@media (max-width: 768px) {
  .chart-container {
    height: 300px; /* Slightly smaller height on medium screens */
  }
  .chart-title {
    font-size: 1.05rem;
    margin-bottom: 15px;
  }
}

@media (max-width: 480px) {
  .chart-container {
    height: 280px; /* Even smaller on mobile */
  }
}
</style>
