import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import markdownImported from './src/plugins/markdown-imported';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@style': resolve(__dirname, 'src/assets/styles')
        }
    },
    plugins: [vue(), markdownImported({ ssr: true })],
    optimizeDeps: {
        exclude: ['vue']
    },
    css: {
        preprocessorOptions: {
            scss: {
                /* None */
            }
        }
    }
});
