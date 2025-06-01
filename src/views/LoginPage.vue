<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-card">
        <h1 class="login-title">Attendance Management</h1>
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">Email</label> <!-- Changed from Username to Email -->
            <input type="text" id="username" v-model="email" placeholder="Enter your email" required />
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" v-model="password" placeholder="Enter your password" required />
          </div>
          <button type="submit" class="login-button">Login</button>
        </form>
        <p v-if="errorMessage" style="color: red; margin-top: 1rem;">{{ errorMessage }}</p> <!-- Display error message -->
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
import { mapActions, mapState } from 'pinia';

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '', // Changed from username to email to match API
      password: '',
      errorMessage: '' // To display login errors
    };
  },
  computed: {
    ...mapState(useAuthStore, ['authError'])
  },
  methods: {
    ...mapActions(useAuthStore, ['login']),
    async handleLogin() {
      this.errorMessage = ''; // Clear previous errors
      const success = await this.login({ email: this.email, password: this.password });
      if (success) {
        this.$router.push('/'); // Redirect to dashboard
      } else {
        // Error message will be set in the store, or use a local one
        this.errorMessage = this.authError || 'Invalid credentials. Please try again.';
        this.password = ''; // Clear password field
      }
    },
  },
  watch: {
    authError(newError) {
      if (newError) {
        this.errorMessage = newError;
      }
    }
  }
};
</script>

<style scoped>
.login-page {
  display: flex;
  align-items: center; /* Vertically center */
  justify-content: center; /* Horizontally center */
  min-height: 100vh; /* Full viewport height */
  background-color: #e0e7ff; /* Light blue background */
}

.login-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.login-card {
  background-color: #ffffff; /* White card */
  padding: 2rem; /* Increased padding */
  border-radius: 12px; /* Softer corners */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15); /* Enhanced shadow */
  width: 100%;
  max-width: 420px; /* Slightly wider card */
  text-align: center;
  border: 1px solid #c7d2fe; /* Subtle border matching the blue theme */
}

.login-title {
  color: #374785; /* Darker Blue for title */
  margin-bottom: 2rem; /* Increased margin */
  font-size: 1.75rem; /* Larger title */
  font-weight: 600;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem; /* Increased margin */
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem; /* Consistent margin */
  color: #4a5568; /* Darker grey for labels */
  font-weight: 500; /* Medium weight */
  font-size: 0.9rem;
}

.form-group input {
  width: 100%;
  padding: 0.875rem 1rem; /* Adjusted padding */
  border: 1px solid #cbd5e0; /* Softer border color */
  border-radius: 6px; /* Softer corners for inputs */
  box-sizing: border-box;
  font-size: 1rem;
  transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
}

.form-group input:focus {
  border-color: #4f46e5; /* Indigo blue focus, matching a potential primary color */
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2); /* Focus ring */
  outline: none;
}

.login-button {
  background-color: #4f46e5; /* Indigo Blue - primary button */
  color: white;
  border: none;
  padding: 0.875rem 1.5rem; /* Adjusted padding */
  border-radius: 6px; /* Softer corners */
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s ease-in-out;
  margin-top: 0.5rem; /* Add some space above the button */
}

.login-button:hover {
  background-color: #4338ca; /* Darker Indigo Blue on hover */
}

/* Responsive adjustments */
@media (max-width: 480px) {
  .login-card {
    padding: 1.5rem;
  }
  .login-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .form-group input,
  .login-button {
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
  }
}
</style>
