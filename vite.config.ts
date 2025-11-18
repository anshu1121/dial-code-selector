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
    },
    // 新增：确保 CSS 被单独提取（而非内联到 JS 中）
    cssCodeSplit: true
  },
  server: {
    port: 3100,
  }
})
