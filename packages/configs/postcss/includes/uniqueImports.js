const postcss = require('postcss');

const postcssUniqueImports = {};

let instance;
let imports = [];

const unique = (arr) => arr.filter((v, i) => arr.indexOf(v) === i);

postcssUniqueImports.append = (...files) => {
  imports = unique(imports.concat(files));
};

postcssUniqueImports.prepend = (...files) => {
  imports = unique(files.concat(imports));
};

postcssUniqueImports.plugin = (...opts) => {
  if (instance) {
    return instance;
  }

  instance = postcss.plugin('postcss-prepend-unique', (initialImports) => {
    if (initialImports) {
      if (typeof initialImports === 'string') {
        imports = [initialImports];
      } else if (initialImports.length) {
        imports = initialImports.filter(Boolean);
      }
    }

    return (root) => {
      if (imports.length === 0) return;

      for (let i = imports.length; i--; ) {
        root.prepend({ name: 'import', params: `'${imports[i]}'` });
      }
    };
  })(...opts);

  return instance;
};

module.exports = postcssUniqueImports;
