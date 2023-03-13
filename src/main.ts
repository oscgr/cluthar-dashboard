import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import VueApexCharts from 'vue3-apexcharts'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg'
import App from '@/App.vue'
import en from '@/locales/en.json'
import fr from '@/locales/fr.json'

const i18n = createI18n({
  locale: 'fr', // set locale
  fallbackLocale: 'fr', // set fallback locale
  messages: { fr, en },
  legacy: false,
})
const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },

})

createApp(App)
  .use(i18n)
  .use(vuetify)
  .use(VueApexCharts)
  .mount('#app')
