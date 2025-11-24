import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindVite from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindVite()],
});
