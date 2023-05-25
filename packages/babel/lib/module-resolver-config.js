// TODO: Map paths from tsconfig.json
module.exports = [
  'module-resolver',
  {
    root: ['./'],
    alias: {
      '@': './src',
      '@/': './src/',
      '@/*': './src/*',
      '@assets': './assets',
      '@c': './src/components',
    },
  },
];
