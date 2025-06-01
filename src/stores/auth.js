import { defineStore } from 'pinia';
import apiClient from '@/services/api';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: localStorage.getItem('accessToken') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: null,
    authError: null,
    isAuthenticated: !!localStorage.getItem('accessToken'),
  }),
  actions: {
    async login(credentials) {
      this.authError = null;
      try {
        const response = await apiClient.post('/auth/login', credentials);
        if (response.data.success) {
          const { access_token, refresh_token } = response.data.data;
          this.accessToken = access_token;
          this.refreshToken = refresh_token;
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          this.isAuthenticated = true;
          return true;
        } else {
          this.authError = response.data.message || 'Login failed';
          this.isAuthenticated = false;
          return false;
        }
      } catch (error) {
        this.authError = error.response?.data?.message || error.message || 'An unexpected error occurred';
        this.isAuthenticated = false;
        return false;
      }
    },
    async signout() {
      this.accessToken = null;
      this.refreshToken = null;
      this.user = null;
      this.authError = null;
      this.isAuthenticated = false;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      delete apiClient.defaults.headers.common['Authorization'];

      // Dynamically import router inside the method to break circular dependency
      try {
        const routerModule = await import('@/router/index.js'); // Or simply '@/router' if your setup resolves it
        const router = routerModule.default; // Assuming router is the default export from router/index.js

        if (router.currentRoute.path !== '/login') {
          router.push('/login').catch(err => {
            if (err.name !== 'NavigationDuplicated' && 
                !err.message.includes('Avoided redundant navigation to current location') &&
                !err.message.includes('Redirected when going from')) {
              console.error('Router push error during signout:', err);
            }
          });
        }
      } catch (e) {
        console.error('Failed to import router for signout navigation:', e);
        // Fallback or further error handling if router can't be imported
      }
    },
    async exchangeToken() {
      this.authError = null;
      const currentRefreshToken = this.refreshToken || localStorage.getItem('refreshToken');
      if (!currentRefreshToken) {
        this.authError = 'No refresh token available. Session expired.';
        // this.isAuthenticated = false; // signout will handle this
        await this.signout(); // Call signout to clear everything and redirect
        return false;
      }
      try {
        const response = await apiClient.post('/auth/exchange-token', {
          refresh_token: currentRefreshToken,
        });
        if (response.data.success) {
          const { access_token, refresh_token } = response.data.data;
          this.accessToken = access_token;
          this.refreshToken = refresh_token;
          localStorage.setItem('accessToken', access_token);
          localStorage.setItem('refreshToken', refresh_token);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
          this.isAuthenticated = true;
          return true;
        } else {
          this.authError = response.data.message || 'Token exchange failed';
          await this.signout(); 
          return false;
        }
      } catch (error) {
        this.authError = error.response?.data?.message || 'An unexpected error occurred during token exchange';
        await this.signout();
        return false;
      }
    },
    checkAuth() {
      const token = localStorage.getItem('accessToken');
      if (token) {
        this.accessToken = token;
        this.refreshToken = localStorage.getItem('refreshToken');
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        this.isAuthenticated = true;
      } else {
        this.accessToken = null;
        this.refreshToken = null;
        this.isAuthenticated = false;
        delete apiClient.defaults.headers.common['Authorization'];
      }
    }
  },
  getters: {
    // getIsAuthenticated: (state) => state.isAuthenticated, // Example getter
  },
});
