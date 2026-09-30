/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/setupTests.ts'],
    css: false,
    // os specs de e2e são do Playwright; o vitest quebra se tentar rodá-los
    exclude: ['**/node_modules/**', '**/dist/**', 'e2e/**'],
  },
});
