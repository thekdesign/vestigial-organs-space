import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwind from '@tailwindcss/vite';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const r = (p) => path.resolve(__dirname, p);

// 純靜態目錄站：沿用 project-common 的 root=resources/js + alias 慣例，
// 但拿掉 auth / api / i18n / pinia / router 等用不到的層，單一 config 即可。
export default defineConfig({
    root: 'resources/js',
    base: '/',
    plugins: [
        vue(),
        tailwind(),
    ],
    resolve: {
        extensions: ['.js', '.json', '.css', '.scss', '.vue'],
        alias: {
            components: r('resources/js/components'),
            css: r('resources/css'),
            data: r('resources/js/data'),
        },
    },
    server: {
        port: 8087,
        host: '0.0.0.0',
        strictPort: true,
    },
    build: {
        outDir: r('dist'),
        emptyOutDir: true,
    },
});
