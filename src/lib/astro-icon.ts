import type { ExtendedIconifyIcon, IconifyJSON } from "@iconify/types";
import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";
import { getIconData } from "@iconify/utils";
import collections, { config, pluginEnabled } from "./virtual";


var devEnvCollections: typeof import("@iconify/collections/index.js").collections | null = null
if (import.meta.env.DEV) {
    devEnvCollections = (await import("@iconify/collections/index.js")).collections
}

async function getCollection(collection: string): Promise<IconifyJSON> {
    if (collection in collections) {
        return collections[collection]
    }

    const set = pluginEnabled ? undefined : await loadCollectionFromFS(collection, false)
    if (!set) {
        const err = new Error(`Unable to locate the "${collection}" set!`);

        if (devEnvCollections) {
            if (collection in devEnvCollections) {
                if (config?.include) {
                    err.hint = `It looks like the "${collection}" set is not included in your configuration.\n\nDo you need to add the "${collection}" set?`;
                } else {
                    err.hint = `It looks like the "${collection}" set exists but it's not installed.\n\nTry installing the "@iconify-json/${collection}" package.`;
                }
            } else {
                err.hint = `It looks like the "${collection}" set doesn't exist.\n\nDid you make a typo?`;
            }
        }
        throw err
    }
    collections[collection] = set
    return set
}

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