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

declare module '*.png' {
    const result: string;
    export default result;
}

declare module '*.jpg' {
    const result: string;
    export default result;
}

declare module '*.jpeg' {
    const result: string;
    export default result;
}

declare module '*.svg' {
    const result: string;
    export default result;
}

declare module '*.gif' {
    const result: string;
    export default result;
}

declare module '*.webp' {
    const result: string;
    export default result;
}

/// <reference types="vite/client" />
