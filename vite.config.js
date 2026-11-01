import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // GitHub Pages serves this project from https://<user>.github.io/happyBirthday/
  // Must match the repository name exactly (Pages URLs are case-sensitive).
  base: '/happyBirthday/',
  plugins: [react(), tailwindcss()],
})
