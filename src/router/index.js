import Vue from 'vue';
import VueRouter from 'vue-router';
import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import EmployeesPage from '../views/EmployeesPage.vue';
import AttendancePage from '../views/AttendancePage.vue';
import SalaryPage from '../views/SalaryPage.vue'; // Ensure this import is present

// Import useAuthStore directly. It's the store definition.
import { useAuthStore } from '../stores/auth';

Vue.use(VueRouter);

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/employees',
    name: 'Employees',
    component: EmployeesPage,
    meta: { requiresAuth: true }
  },
  {
    path: '/attendance',
    name: 'Attendance',
    component: AttendancePage,
    meta: { requiresAuth: true }
  },
  {
    path: '/salary',
    name: 'Salary',
    component: SalaryPage, // Ensure this component is correctly assigned
    meta: { requiresAuth: true }
  },
  {
    path: '*',
    redirect: '/',
  },
];

const router = new VueRouter({
  mode: 'history',
  base: "/",
  routes,
});

// Export a function to setup navigation guards
export function setupRouterGuards(piniaInstance) {
  router.beforeEach(async (to, from, next) => {
    // Use the passed piniaInstance when calling useAuthStore
    const authStore = useAuthStore(piniaInstance);

    // Always call checkAuth to ensure the store reflects the latest token status from localStorage.
    // checkAuth() will update isAuthenticated based on token presence.
    authStore.checkAuth(); 

    const isAuthenticated = authStore.isAuthenticated;

    // If trying to access login page while already authenticated
    if (to.path === '/login' && isAuthenticated) {
      next({ path: '/' }); // Redirect to dashboard or home
      return; // Important to return after calling next()
    }

    // If route requires authentication
    if (to.matched.some(record => record.meta.requiresAuth)) {
      if (!isAuthenticated) {
        next({
          path: '/login',
        });
      } else {
        next(); // Proceed if authenticated
      }
    } else {
      next(); // For public routes, always proceed
    }
  });
}

export default router;
