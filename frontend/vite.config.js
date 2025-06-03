import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy all requests starting with /api to the backend server
      '/api': {
        target: 'http://localhost:80', // Assuming your backend runs on port 80
        changeOrigin: true,
      },
      // Proxy WebSocket connections
      '/socket.io': {
        target: 'ws://localhost:80', // Assuming your backend runs on port 80
        ws: true,
      },
    }
  }
})
