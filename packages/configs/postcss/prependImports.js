const postcss = require('postcss');

module.exports = postcss.plugin(
  'postcss-prepend-imports',
  ({ files }) => root => {
    files
      .filter(Boolean)
      .reverse()
      .forEach(file => {
        root.prepend({ name: 'import', params: `'${file}'` });
      });
  },
);
