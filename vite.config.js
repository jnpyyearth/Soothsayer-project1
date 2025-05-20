import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    //ช่วย redirect ไปที่ backend rest api โดยใช้ proxy
    proxy: {
      '/get_data': 'http://localhost:5000',
      '/update_row': 'http://localhost:5000'
    }
  }
})