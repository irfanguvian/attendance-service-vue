import Vue from 'vue';
import App from './App.vue';
import router, { setupRouterGuards } from './router'; // Import router and setupRouterGuards
import { createPinia, PiniaVuePlugin } from 'pinia';

import './assets/main.css';

Vue.use(PiniaVuePlugin);
const pinia = createPinia();

// Call setupRouterGuards and pass the pinia instance
setupRouterGuards(pinia);

Vue.config.productionTip = false;

new Vue({
  router,
  pinia, // Provide pinia to the Vue instance
  created() {
    // The auth check is now primarily handled by the router guard
    // but ensuring the store is initialized here is still good practice.
    // const authStore = useAuthStore(pinia); // Pass pinia instance
    // authStore.checkAuth(); // This can be removed if router guard handles it sufficiently
  },
  render: h => h(App),
}).$mount('#app');
