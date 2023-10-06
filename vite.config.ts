import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  publicDir: 'public',
  test: {
    coverage: {
      provider: 'istanbul', // or 'c8'
    },
    watch: false,
  },
})
