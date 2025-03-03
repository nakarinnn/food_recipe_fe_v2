import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: {
    // สามารถใส่ค่าที่ต้องการได้ในนี้ (เช่นการกำหนดค่าคงที่)
  },

  server: {
    proxy: {
      // ตัวอย่างการตั้งค่า Proxy
      '/api': {
        target: 'https://food-recipe-be-wsb1.onrender.com',  // URL ของ backend ที่คุณต้องการ proxy
        changeOrigin: true,              // เพื่อให้ request header มี origin ที่ถูกต้อง
        secure: true,                  // ถ้า target server ใช้ http แทน https ให้ตั้งเป็น false
      },
    },
  },
})
