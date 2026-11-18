import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from 'vite-plugin-singlefile'

// `npm run build` produces ONE self-contained dist/index.html (all JS, CSS and
// imported images are inlined), so it opens with a plain double-click (file://).
// base './' keeps any remaining paths (e.g. favicon) relative instead of drive-root.
export default defineConfig({
  base: './',
  plugins: [react(), viteSingleFile()],
  build: { chunkSizeWarningLimit: 5000 },
})
