import { defineConfig } from 'vitest/config'

export default defineConfig({
  define: {
    'import.meta.vitest': 'undefined',
  },
  test: {
    coverage: {
      provider: 'istanbul', // or 'c8'
    },
  },
})
