import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(({ command }) => {
  // Base configuration:
  // - When VITE_BASE is specified (such as in .github/workflows/deploy.yml: VITE_BASE=/Jourj/), use that.
  // - In development server ('serve'), use '/'.
  // - In standard production deployments (Cloud Run, shared URL, root domain, custom hosting),
  //   use './' so all assets load relative to index.html with zero 404 errors.
  const isDev = command === 'serve';
  const base = process.env.VITE_BASE || (isDev ? '/' : (process.env.GITHUB_ACTIONS ? '/Jourj/' : './'));

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
