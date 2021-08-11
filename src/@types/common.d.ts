declare module '*.vue' {
    import { DefineComponent } from 'vue';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
    const component: DefineComponent<{}, {}, any>;
    export default component;
}

declare module 'markdown-it';

declare module '*.md' {
    const markdown: string;
    export const token: {
        tag: number;
        value: string;
        lang?: string;
    }[];
    export default markdown;
}

/// <reference types="vite/client" />
