import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'src/lib/index.ts',
      name: 'DialCodeSelector',
      fileName: 'dial-code-selector'
    },
    rollupOptions: {
      external: ['vue', 'i18n-iso-countries', 'libphonenumber-js', 'flag-icons'],
      output: {
        globals: { 
          vue: 'Vue',
          'i18n-iso-countries': 'i18nIsoCountries',
          'libphonenumber-js': 'libphonenumberJs',
          'flag-icons': 'flagIcons'
        }
      }
    }
  },
  server: {
    port: 3100,
  }
})
