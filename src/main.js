import Vue from 'vue';
import App from './App.vue';
import router from './router'; // Your Vue Router 2.x/3.x instance
import { createPinia, PiniaVuePlugin } from 'pinia'; // Pinia v1 for Vue 2

import './assets/main.css';

Vue.use(PiniaVuePlugin); // Use PiniaVuePlugin for Vue 2
const pinia = createPinia();

Vue.config.productionTip = false;

new Vue({
  router,
  pinia, // Pass the pinia instance
  render: h => h(App),
}).$mount('#app');
