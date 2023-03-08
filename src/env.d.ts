/// <reference types="astro/client" />

declare type AstroIconConfig = { include: Record<string, string> }

declare module "virtual:astro-icon" {
    import type { IconifyJSON } from '@iconify/types';

    export const pluginEnabled: boolean
    const collections: Record<string, IconifyJSON>
    export default collections
    export const config: AstroIconConfig | null
}

declare interface Error extends Error {
    hint?: string
}