import type { IconifyJSON } from '@iconify/types';

async function importVirtual() {
    try {
        // not using string literal to silence vite warnings when plugin is disabled
        return await import("virtual:astro-icon");
    } catch {
        console.info("astro-icon plugin not enabled. Loading collections lazily...")
        return null
    }
}

const virtual = await importVirtual()
export var pluginEnabled = virtual?.pluginEnabled ?? false
export default virtual?.default ?? {}
export var config: AstroIconConfig | null = virtual?.config ?? null
