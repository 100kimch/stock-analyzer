import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
// eslint-disable-next-line
import LoadScript from "vue-plugin-load-script";
import GoogleCharts from "vue-google-charts";

Vue.config.productionTip = false;

Vue.use(LoadScript);
Vue.use(GoogleCharts);

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
