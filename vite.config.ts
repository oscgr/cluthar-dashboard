import path from 'node:path'
import { defineConfig } from 'vite'
import Vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'

export default defineConfig({
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  plugins: [
    Vue({
      include: [/\.vue$/, /\.md$/],
    }),
    VueI18nPlugin({
      // runtimeOnly: true,

      include: path.resolve(__dirname, './src/locales/**'),
    }),
    // https://github.com/antfu/vite-plugin-pwa
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Cluthar dashboard',
        short_name: 'Cluthar',
        theme_color: '#A89D8D',
        background_color: '#f0ece3',
        icons: [
          {
            src: 'public/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'public/manifest-icon-192.maskable.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: 'public/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'public/manifest-icon-512.maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),

  ],

  optimizeDeps: {
    include: [
      'vue',
      '@vueuse/core',
    ],
    exclude: [
      'vue-demi',
    ],
  },
})
