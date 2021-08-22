import { Plugin } from 'vite';

export default {
    name: 'vite-plugin-markdown-imported',
    enforce: 'pre',
    async transform(code: string, id: string) {
        if (!id.endsWith('.md')) {
            return null;
        }

        return `export default ${JSON.stringify(code)};`;
    }
} as Plugin;
