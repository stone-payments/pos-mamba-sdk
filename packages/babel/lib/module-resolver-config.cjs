// TODO: Map paths from tsconfig.json

// const { join, resolve, dirname } = require('node:path');
// const { existsSync } = require('node:fs');
// const tsConfig = require('tsconfig');
// const tsConfigPaths = require('tsconfig-paths');

// tsConfigPaths.register();

// const loadResult = tsConfig.loadSync(process.cwd(), undefined);

// Create function that will match paths
/* const matchPath = tsConfigPaths.createMatchPath(
  join(dirname(loadResult.path), loadResult.config.compilerOptions.baseUrl),
  loadResult.config.compilerOptions.paths,
); */

module.exports = [
  'module-resolver',
  {
    root: [process.cwd()],
    alias: {
      '@': './src',
      '@/': './src/',
      '@/*': './src/*',
      '@assets': './assets',
      '@c': './src/components',
      '@routes': './src/routes',
    },
  },
];
