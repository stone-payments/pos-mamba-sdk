const { resolve } = require('path')

/** Defaults process.env.NODE_ENV to 'development */
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

module.exports = {
  /** Current project's package.json */
  PKG: require(resolve(process.cwd(), 'package.json')),
  IS_PROD: process.env.NODE_ENV === 'production',
  IS_TEST: process.env.NODE_ENV === 'test',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_WATCHING:
    require.main.filename.includes('webpack-dev-server') ||
    require.main.filename.includes('webpack-serve'),
}
