import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 5173
    },
    plugins: [react()],
    build: {
        minify: true,
        sourcemap: false
    },
    define: {
        global: "window",
    },
})
