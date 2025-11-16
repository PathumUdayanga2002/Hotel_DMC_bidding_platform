import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
  define: {
    global: 'window', // ✅ Fix for "global is not defined" (SockJS)
  },
  optimizeDeps: {
    include: ['@stomp/stompjs', 'sockjs-client'], // ✅ Ensures Vite prebundles these
  },
});
