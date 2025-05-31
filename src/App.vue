<template>
  <div id="app">
    <header v-if="!isLoginPage" class="app-header">
      <div class="header-content">
        <div class="logo"></div>
        <button @click="toggleMobileNav" class="hamburger-menu" aria-label="Toggle navigation" aria-expanded="isMobileNavOpen">
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
          <span class="hamburger-bar"></span>
        </button>
        <nav :class="['app-nav', { 'is-open': isMobileNavOpen }]">
          <router-link to="/" @click.native="closeMobileNav">Dashboard</router-link>
          <router-link to="/employees" @click.native="closeMobileNav">Employees</router-link>
          <router-link to="/attendance" @click.native="closeMobileNav">Attendance</router-link>
          <router-link to="/salary" @click.native="closeMobileNav">Salary</router-link>
          <button @click="logoutAndCloseMobileNav" class="logout-button">Logout</button>
        </nav>
      </div>
    </header>
    <main class="app-main">
      <router-view />
    </main>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isMobileNavOpen: false,
    };
  },
  computed: {
    isLoginPage() {
      return this.$route.name === 'Login';
    }
  },
  methods: {
    logout() {
      console.log('Logout clicked');
      localStorage.removeItem('user-token');
      this.$router.push('/login');
    },
    toggleMobileNav() {
      this.isMobileNavOpen = !this.isMobileNavOpen;
    },
    closeMobileNav() {
      this.isMobileNavOpen = false;
    },
    logoutAndCloseMobileNav() {
      this.logout();
      this.closeMobileNav();
    }
  },
  watch: {
    // Close mobile nav if route changes
    $route() {
      this.closeMobileNav();
    }
  }
};
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f0f2f5; /* Consistent light background */
}

.app-header {
  background-color: #2c3e50; /* Dark blue */
  color: white;
  height: 70px; /* Slightly taller header */
  box-shadow: 0 2px 5px rgba(0,0,0,0.15);
  position: sticky;
  top: 0;
  z-index: 1000; /* Ensure header is above other content */
  padding: 0 1.5rem; /* Horizontal padding */
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  max-width: 1200px; /* Optional: constrain header width */
  margin: 0 auto; /* Center content if max-width is used */
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.app-nav {
  display: flex;
  align-items: center;
  gap: 1.8rem;
}

.app-nav a {
  font-weight: 500;
  color: #e0e0e0; /* Lighter white for inactive links */
  text-decoration: none;
  padding: 0.5rem 0.2rem;
  position: relative;
  transition: color 0.2s ease;
}

.app-nav a::after {
  content: '';
  position: absolute;
  bottom: -4px; /* Underline position */
  left: 0;
  width: 0;
  height: 2px;
  background-color: #e74c3c;
  transition: width 0.2s ease, background-color 0.2s ease;
}

.app-nav a.router-link-exact-active {
  color: #ffffff; /* Bright white for active link */
}

.app-nav a.router-link-exact-active::after {
  width: 100%;
}

.app-nav a:hover {
  color: #ffffff;
}
.app-nav a:hover::after {
  width: 100%;
  background-color: #f39c12;
}

.logout-button {
  background-color: transparent; 
  color: #e0e0e0;
  border: 1px solid #e74c3c; 
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s ease, color 0.2s ease;
  margin-left: 1rem; /* Space from nav links */
}

.logout-button:hover {
  background-color: #e74c3c;
  color: white;
}

.hamburger-menu {
  display: none; /* Hidden by default */
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 1001; /* Above nav */
}

.hamburger-bar {
  display: block;
  width: 25px;
  height: 3px;
  margin: 5px auto;
  background-color: white;
  transition: all 0.3s ease-in-out;
}

.app-main {
  flex-grow: 1;
  background-color: #f0f2f5; 
}

/* Responsive adjustments for header - Hamburger Menu */
@media (max-width: 768px) {
  .app-header {
    padding: 0 1rem;
  }
  .app-nav {
    position: absolute;
    top: 70px; /* Position below header */
    left: 0;
    right: 0;
    background-color: #34495e; /* Slightly different background for mobile nav */
    flex-direction: column;
    align-items: center; /* Center items in mobile nav */
    padding: 1rem 0;
    gap: 0; /* Remove gap, use padding on links */
    box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    transform: translateY(-150%); /* Hide off-screen */
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    opacity: 0;
    max-height: calc(100vh - 70px);
    overflow-y: auto;
  }

  .app-nav.is-open {
    transform: translateY(0);
    opacity: 1;
  }

  .app-nav a {
    color: white;
    padding: 1rem 0;
    width: 100%;
    text-align: center;
    border-bottom: 1px solid #4a627a; /* Separator for links */
  }
  .app-nav a:last-of-type {
    border-bottom: none;
  }

  .app-nav a::after {
    display: none; /* No underlines in mobile nav */
  }
  .app-nav a.router-link-exact-active {
    background-color: #2c3e50; /* Active link background */
    color: #e74c3c;
  }

  .logout-button {
    margin: 1rem 0 0 0; /* Reset margin */
    width: 80%;
    padding: 0.8rem 1rem;
    border-color: #e74c3c;
    color: #e74c3c;
  }
  .logout-button:hover {
    background-color: #e74c3c;
    color: white;
  }

  .hamburger-menu {
    display: block;
  }

  /* Hamburger animation when open */
  .hamburger-menu[aria-expanded="true"] .hamburger-bar:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
  }
  .hamburger-menu[aria-expanded="true"] .hamburger-bar:nth-child(2) {
    opacity: 0;
  }
  .hamburger-menu[aria-expanded="true"] .hamburger-bar:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
  }
}
</style>
