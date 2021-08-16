import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from "@vitejs/plugin-vue-jsx";
import poke from './src/plugins/poke';
import { resolve } from 'path';

export default defineConfig({
    resolve: {
        alias: {
            '~': __dirname,
            '@': resolve(__dirname, 'src'),
            '@styles': resolve(__dirname, 'src/assets/styles'),
            '@icons': resolve(__dirname, 'src/assets/icons'),
        }
    },
    plugins: [vue(), vueJsx(), poke({ ssr: true })],
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
