/// <reference types="astro/client" />

type AstroIconConfig = { include: Record<string, string> }

var __ASTRO_ICON_COLLECTIONS: Record<string, IconifyJSON> | undefined
var __ASTRO_ICON_CONFIG: AstroIconConfig | undefined

interface Error extends Error {
    hint?: string
}


