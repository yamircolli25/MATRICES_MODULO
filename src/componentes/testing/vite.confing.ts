import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    test:{
        globals:true,
        enviroment:'jsdom',
        setupFiles:'./src/setupTests.ts'
    }
});