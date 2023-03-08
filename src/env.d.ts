/// <reference types="astro/client" />

declare module "virtual:astro-icon" {
    import type { IconifyJSON } from '@iconify/types';

    const collections: IconifyJSON[]
    export default collections
    export const config: { include: string[] } | undefined
}

declare interface Error extends Error {
    hint?: string
}