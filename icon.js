import { getIcons } from '@iconify/utils';
import { loadCollection, locate } from '@iconify/json';

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
      loadCollection(locate(collection)).then((value) => [collection, value])
    )
  );
  const collections = fullCollections.map(([name, icons]) => {
    const reduced = include[name];
    if (reduced.length === 1 && reduced[0] === '*') return icons;
    return getIcons(icons, reduced);
  });

  return {
    name: 'astro-icon',
    resolveId(id) {
      if (id === virtualModuleId) {
        return resolvedVirtualModuleId;
      }
    },
    async load(id) {
      if (id === resolvedVirtualModuleId) {
        console.log(Object.keys(collections))
        return `export default ${JSON.stringify(
          collections
        )};\nexport const config = ${command === 'dev' ? JSON.stringify({ include }) : 'undefined'
          }`;
      }
    },
  };
}
