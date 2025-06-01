<template>
  <div class="toast" :class="toastClass" v-if="visible">
    <div class="toast-icon">
      <!-- You can use actual icons here -->
      <span v-if="type === 'success'">✔️</span>
      <span v-if="type === 'error'">❌</span>
      <span v-if="type === 'warning'">⚠️</span>
      <span v-if="type === 'info'">ℹ️</span>
    </div>
    <div class="toast-content">
      <p class="toast-message">{{ message }}</p>
    </div>
    <button @click="hideToast" class="toast-close-button">&times;</button>
  </div>
</template>

<script>
export default {
  name: 'ToasterNotification',
  props: {
    initialMessage: { type: String, default: '' },
    initialType: { type: String, default: 'info' }, // success, error, warning, info
    duration: { type: Number, default: 3000 }, // Duration in ms, 0 for persistent
  },
  data() {
    return {
      visible: false,
      message: '',
      type: 'info',
      timeoutId: null,
    };
  },
  computed: {
    toastClass() {
      return `toast-${this.type}`;
    },
  },
  methods: {
    showToast(message, type = 'info', duration) {
      this.message = message;
      this.type = type;
      this.visible = true;

      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }

      const effectiveDuration = duration !== undefined ? duration : this.duration;
      if (effectiveDuration > 0) {
        this.timeoutId = setTimeout(() => {
          this.hideToast();
        }, effectiveDuration);
      }
    },
    hideToast() {
      this.visible = false;
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
        this.timeoutId = null;
      }
      this.$emit('closed'); // Emit an event when toast is closed
    },
  },
  mounted() {
    if (this.initialMessage) {
      this.showToast(this.initialMessage, this.initialType, this.duration);
    }
    // Listen for global event to show toast
    this.$root.$on('show-toast', ({ message, type, duration }) => {
      this.showToast(message, type, duration);
    });
  },
  beforeDestroy() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.$root.$off('show-toast');
  },
};
</script>

<style scoped>
.toast {
  position: fixed;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  padding: 12px 20px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  color: #fff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  font-size: 0.9rem;
  z-index: 9999;
  min-width: 280px;
  max-width: 350px;
  transition: transform 0.3s ease-out, opacity 0.3s ease-out;
}

.toast-icon {
  margin-right: 12px;
  font-size: 1.2rem;
}

.toast-content {
  flex-grow: 1;
}

.toast-message {
  margin: 0;
  line-height: 1.4;
}

.toast-close-button {
  background: none;
  border: none;
  color: inherit;
  font-size: 1.5rem;
  margin-left: 15px;
  padding: 0;
  cursor: pointer;
  line-height: 1;
  opacity: 0.8;
}
.toast-close-button:hover {
  opacity: 1;
}

.toast-success {
  background-color: #4CAF50; /* Green */
}

.toast-error {
  background-color: #F44336; /* Red */
}

.toast-warning {
  background-color: #FF9800; /* Orange */
}

.toast-info {
  background-color: #2196F3; /* Blue */
}
</style>
