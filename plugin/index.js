import { getIcons } from '@iconify/utils';
import { loadCollectionFromFS } from "@iconify/utils/lib/loader/fs";

/** @returns {import('astro').AstroIntegration} */
export default function icon(opts = {}) {
  return {
    name: 'astro-icon',
    hooks: {
      async 'astro:config:setup'({ updateConfig, command }) {
        updateConfig({
          vite: {
            plugins: [await getVitePlugin(opts, command)],
          },
        });
      },
    },
  };
}

/** @returns {import('vite').Plugin} */
async function getVitePlugin({ include = {} }, command) {
  const virtualModuleId = 'virtual:astro-icon';
  const resolvedVirtualModuleId = '\0' + virtualModuleId;

  const fullCollections = await Promise.all(
    Object.keys(include).map((collection) =>
      loadCollectionFromFS(collection).then((value) => [collection, value])
    )
  );
  /** @type {Record<string, import("@iconify/types").IconifyJSON>} */
  const collections = {}
  for (const [name, collection] of fullCollections) {
    const reduced = include[name];
    // include all icons in the collection
    if (reduced.length === 1 && reduced[0] === '*' && collection) {
      collections[name] = collection;
    }
    const reducedCollection = getIcons(collection, reduced)
    if (reducedCollection) {
      collections[name] = reducedCollection;
    }
  }

  return {
    name: 'astro-icon',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        return `export const pluginEnabled = true;\nexport default ${JSON.stringify(
          collections
        )};\nexport const config = ${command === 'dev' ? JSON.stringify({ include }) : 'null'
          }`;
      }
    },
  };
}
