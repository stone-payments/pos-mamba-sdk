let instance;
let imports = [];

const postcssUniqueImports = (initialImports) => {
  if (instance) {
    return instance;
  }

  if (initialImports) {
    if (typeof initialImports === 'string') {
      imports = [initialImports];
    } else if (initialImports.length) {
      imports = initialImports.filter(Boolean);
    }
  }

  imports = imports.map((i) => ({ name: 'import', params: `'${i}'` }));

  return {
    postcssPlugin: 'postcss-prepend-unique',
    Once(root) {
      if (imports.length === 0) return;

      for (let i = imports.length; i--; ) {
        root.prepend({ name: 'import', params: `'${imports[i]}'` });
      }
    },
  };
};

postcssUniqueImports.postcss = true;
export default postcssUniqueImports;
