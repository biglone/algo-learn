import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        allowedHosts: ['.biglone.tech'],
        proxy: {
            '/api/run/cpp': {
                target: 'http://127.0.0.1:8080',
                changeOrigin: true,
            },
            '/api/run/go': {
                target: 'http://127.0.0.1:8081',
                changeOrigin: true,
            },
            '/api/run/rust': {
                target: 'http://127.0.0.1:8082',
                changeOrigin: true,
            },
        },
    },
})
