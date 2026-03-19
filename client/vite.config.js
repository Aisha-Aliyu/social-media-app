import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      clientPort: 443,
      protocol: 'wss',
    },
    host: true,
    port: 5173,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('react-router')) return 'vendor'
            if (id.includes('framer-motion')) return 'motion'
            if (id.includes('socket.io-client')) return 'socket'
            if (id.includes('@tanstack')) return 'query'
            if (id.includes('zustand')) return 'store'
            if (id.includes('react')) return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    minify: 'oxc',
  },
})
