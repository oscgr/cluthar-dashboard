import { createApp } from 'vue'
import { createI18n, useI18n } from 'vue-i18n'
import VueApexCharts from 'vue3-apexcharts'

import 'vuetify/styles'
import type { ThemeDefinition } from 'vuetify'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import draggable from 'vuedraggable'
import { wi } from '@/assets/iconsets/wi'
import App from '@/App.vue'

import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

import '@fontsource/roboto/latin.css'
import '@fontsource/roboto-condensed/latin.css'
import { createVueI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'

const en = async () => (await import('@/locales/en.json')).default
const fr = async () => (await import('@/locales/fr.json')).default
// @ts-ignore
const vuetifyFr = async () => (await import('vuetify/lib/locale/fr.mjs')).default
// @ts-ignore
const vuetifyEn = async () => (await import('vuetify/lib/locale/en.mjs')).default

const locale = navigator.language.split('-')[0]

const light: ThemeDefinition = {
  dark: false,
  colors: {
    'background': '#f0ece3',
    'surface': '#FFFFFA',
    'primary': '#A89D8D',
    'primary-darken-1': '#4F4537',
    'secondary': '#BBDCD0',
    'secondary-darken-1': '#85A59A',
    'error': '#C1554D',
    'info': '#2196F3',
    'success': '#00917C',
    'warning': '#FF8A5E',
  },
}
const dark: ThemeDefinition = {
  dark: true,
  colors: {
    'background': '#1a4a50',
    'surface': '#0c3036',
    'primary': '#7a624c',
    'primary-darken-1': '#7a624c',
    'secondary': '#801336',
    'secondary-darken-1': '#520d23',
    'error': '#C1554D',
    'info': '#2196F3',
    'success': '#00917C',
    'warning': '#FF8A5E',
  },
}

const i18n = createI18n({
  locale,
  fallbackLocale: 'en',
  legacy: false,
  globalInjection: true,
  messages: {},
  silentTranslationWarn: import.meta.env.PROD,
})

if (locale === 'fr')
  i18n.global.setLocaleMessage('fr', { ...(await fr()), $vuetify: (await vuetifyFr()) })
else
  i18n.global.setLocaleMessage('en', { ...(await en()), $vuetify: (await vuetifyEn()) })

const vuetify = createVuetify({
  components,
  locale: {
    adapter: createVueI18nAdapter({ i18n, useI18n }),
  },
  theme: {
    themes: {
      light,
      dark,
    },
  },
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
      wi,
    },
  },
})

createApp(App)
  .use(i18n)
  .use(vuetify)
  .use(VueApexCharts)
  .component('VueDraggable', draggable)
  .mount('#app')
