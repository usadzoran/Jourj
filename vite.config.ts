import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  // Base configuration for GitHub Pages: https://usadzoran.github.io/Jourj/
  // - In development server ('serve'), use '/'
  // - In production builds for GitHub Pages, base is '/Jourj/' matching repository name
  // - Can be overridden by VITE_BASE environment variable
  const isDev = command === 'serve';
  const base = process.env.VITE_BASE || (isDev ? '/' : '/Jourj/');

  return {
    base,
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
