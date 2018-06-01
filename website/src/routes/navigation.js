export default [
  { title: 'Getting Started', to: '/' },
  {
    title: 'Native API',
    to: '/native',
    submenu: [{ title: 'Quickstart', to: '/native/quickstart' }],
  },
  { title: 'Styles', to: '/styles' },
  {
    title: 'Components',
    to: '/components',
    submenu: [
      { title: 'App', to: '/app' },
      { title: 'AppBar', to: '/appbar' },
      { title: 'Collection', to: '/collection' },
      { title: 'Dialog', to: '/dialog' },
      { title: 'Icon', to: '/icon' },
      { title: 'POS', to: '/pos' },
      { title: 'Switch', to: '/switch' },
    ],
  },
  { title: 'Utils', to: '/utils' },
  { title: 'Development', to: '/development' },
]
