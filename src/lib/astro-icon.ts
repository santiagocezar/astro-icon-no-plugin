import type { ExtendedIconifyIcon, IconifyJSON } from "@iconify/types";
import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";
import { getIconData } from "@iconify/utils";

// we want the icons to work regardless if the plugin is enabled or not
const pluginEnabled = globalThis.__ASTRO_ICON_COLLECTIONS !== undefined;
const collections = globalThis.__ASTRO_ICON_COLLECTIONS ?? {};
const config = globalThis.__ASTRO_ICON_CONFIG ?? null;

if (!pluginEnabled)
    console.info("astro-icon plugin not enabled. Loading collections lazily...")


// a list of all collections provided by iconify.
// has no use in production, it's just to hint the
// developer if they misstyped the name of a collection
var __existingCollections: typeof import("@iconify/collections/index.js").collections | null = null
if (import.meta.env.DEV) {
    __existingCollections = (await import("@iconify/collections/index.js")).collections
}

/**
 * Loads a collection from cache, the plugin, or the filesystem 
 * @param name the prefix for the collection
 * @returns a collection of icons
 */
async function getCollection(name: string): Promise<IconifyJSON> {
    if (name in collections) {
        return collections[name]
    }
    let set: IconifyJSON | undefined = undefined
    if (!pluginEnabled) {
        set = await loadCollectionFromFS(name, false)
    }

    if (!set) {
        const err = new Error(`Unable to locate the "${name}" set!`);

        if (__existingCollections) {
            if (name in __existingCollections) {
                if (config?.include) {
                    err.hint = `It looks like the "${name}" set is not included in your configuration.\n\nDo you need to add the "${name}" set?`;
                } else {
                    err.hint = `It looks like the "${name}" set exists but it's not installed.\n\nTry installing the "@iconify-json/${name}" package.`;
                }
            } else {
                err.hint = `It looks like the "${name}" set doesn't exist.\n\nDid you make a typo?`;
            }
        }
        throw err
    }

    collections[name] = set

    return set
}

/**
 * Loads an icon from a collection
 * @param collection the prefix for the collection
 * @param name the name of the icon
 * @returns the icon
 */
export async function getIcon(collection: string, name: string): Promise<ExtendedIconifyIcon> {
    const set = await getCollection(collection)
    const icon = getIconData(set, name)
    if (!icon) {
        const err = new Error(`Unable to locate "${name}" icon!`);
        if (import.meta.env.DEV) {
            if (config?.include) {
                err.hint = `The "${collection}" set does not include a "${name}" icon.\n\nDid you forget to include the icon or make a typo?`;
            } else {
                err.hint = `The "${collection}" set does not include an icon named "${name}".\n\nIs this a typo? Is the "@iconify/json" or "@iconify-json/${collection}" dependency out of date?`;
            }
        }
        throw err
    }
    return icon
}