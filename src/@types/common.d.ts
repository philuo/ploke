declare module '*.vue' {
    import { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module 'markdown-it';

declare module '*.md' {
    const html: string;
    export const markdown: string;
    export default html;
}

/// <reference types="vite/client" />
