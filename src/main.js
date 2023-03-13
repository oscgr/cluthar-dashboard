import '@/plugins/compositionApi'
import '@/plugins/apexCharts'

import Vue from 'vue';
import App from './App.vue';
import i18n from './i18n';
import vuetify from './plugins/vuetify';
import moment from 'moment'

moment.locale('fr')

Vue.config.productionTip = false;

new Vue({
  i18n,
  vuetify,
  render: (h) => h(App),
}).$mount('#app');
