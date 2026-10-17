import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Only scan the live entry; archived Academy/Playbook pages in /archive are kept for later, not served.
  optimizeDeps: { entries: ['index.html'] },
})
