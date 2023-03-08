import { ExtendedIconifyIcon, IconifyJSON } from "@iconify/types";
import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";
import { collections as existingCollections } from "@iconify/collections/index";
import { getIconData } from "@iconify/utils";


const collections = new Map<string, IconifyJSON>()

async function getCollection(collection: string): Promise<IconifyJSON | undefined> {
    if (collections.has(collection)) {
        return collections.get(collection)
    }

    const set = await loadCollectionFromFS(collection, false)
    if (!set) {
        const err = new Error(`Unable to locate the "${collection}" set!`);

        if (collection in existingCollections) {
            err.hint = `It looks like the "${collection}" set exists but it's not installed.\n\nTry installing the "@iconify-json/${collection}" package.`;
        } else {
            err.hint = `It looks like the "${collection}" set doesn't exist.\n\nDid you make a typo?`;
        }

        throw err
    }
    return set
}

export async function getIcon(collection: string, name: string): Promise<ExtendedIconifyIcon> {
    const set = await getCollection(collection)
    const icon = getIconData(set, name)
    if (!icon) {
        const err = new Error(`Unable to locate "${name}" icon!`);
        err.hint = `The "${collection}" set does not include an icon named "${icon}".\n\nIs this a typo? Is the "@iconify/json" or "@iconify-json/${collection}" dependency out of date?`;
    }
    return icon
}