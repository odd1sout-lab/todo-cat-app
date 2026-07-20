import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// Если деплоите на GitHub Pages по адресу username.github.io/todo-cat-app/,
// оставьте base как есть. Если репозиторий называется иначе — поменяйте здесь.
export default defineConfig({
  base: './',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Кот компаньон — задачи, помодоро и котик',
        short_name: 'Кот компаньон',
        description: 'Задачи, помодоро, табата и виртуальный котик-компаньон',
        theme_color: '#7c5cff',
        background_color: '#191825',
        display: 'standalone',
        start_url: './',
        scope: './',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico}']
      }
    })
  ]
})
