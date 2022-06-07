const { readdirSync, statSync, existsSync } = require('fs');
const { resolve } = require('path');
const { getPkg } = require('quickenv');

const getDirs = (p) => readdirSync(p).filter((f) => statSync(resolve(p, f)).isDirectory());

const getMaps = (path) => {
  const dirPkg = getPkg({ path, traverse: false });

  /** If passed a package directory, read only its directory */
  if (dirPkg) {
    const entryFile = dirPkg.svelte || dirPkg.module || dirPkg.main;
    if (entryFile) {
      const entryPath = resolve(path, entryFile);

      if (existsSync(entryPath)) {
        return { [`${dirPkg.name}$`]: entryPath };
      }
    }
  }

  /** If not, scan the passed path directories and assume they're packages */
  return getDirs(path).reduce((acc, dirName) => {
    const pkg = getPkg({ path: resolve(path, dirName), traverse: false });

    if (pkg) {
      const entryFile = pkg.svelte || pkg.module || pkg.main;
      if (entryFile) {
        const entryPath = resolve(path, dirName, entryFile);

        if (existsSync(entryPath)) {
          acc[`${pkg.name}$`] = entryPath;
        }
      }
    }

    return acc;
  }, {});
};

module.exports = (dirs) => {
  if (!Array.isArray(dirs)) {
    return getMaps(dirs);
  }

  return dirs.reduce(
    (acc, dir) => ({
      ...acc,
      ...getMaps(dir),
    }),
    {},
  );
};
