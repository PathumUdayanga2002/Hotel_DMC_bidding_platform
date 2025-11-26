import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  define: {
    global: 'window', // ✅ Fix for "global is not defined" (SockJS)
  },
  optimizeDeps: {
    include: ['@stomp/stompjs', 'sockjs-client'], // ✅ Ensures Vite prebundles these
  },
  server: {
    hmr: {
      overlay: false, // Disable error overlay that might cause reloads
    },
  },
});
