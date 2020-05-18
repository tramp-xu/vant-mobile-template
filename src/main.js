import Vue from 'vue';
import 'amfe-flexible';
import App from './App';
import { router } from './router';

new Vue({
  router,
  el: '#app',
  render: h => h(App)
});
