import Vue from 'vue';
import VueRouter from 'vue-router';

// Import your page components here
// We will create these placeholder files next
import LoginPage from '../views/LoginPage.vue';
import DashboardPage from '../views/DashboardPage.vue';
import EmployeesPage from '../views/EmployeesPage.vue';
import AttendancePage from '../views/AttendancePage.vue';
import SalaryPage from '../views/SalaryPage.vue';

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
    meta: { requiresAuth: true } // Example for protected routes
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
    component: SalaryPage,
    meta: { requiresAuth: true }
  },
  // Redirect to login if no other route matches and not authenticated
  // or to dashboard if authenticated
  {
    path: '*',
    redirect: '/', // Or '/login' depending on auth logic
  },
];

const router = new VueRouter({
  mode: 'history', // Use history mode for cleaner URLs
  base: "/", // Base URL for the application
  routes,
});

// Navigation guard (optional, for authentication)
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user-token'); // Example auth check
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !isAuthenticated) {
    next('/login');
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/'); // If user is authenticated and tries to go to login, redirect to dashboard
  } else {
    next();
  }
});

export default router;
