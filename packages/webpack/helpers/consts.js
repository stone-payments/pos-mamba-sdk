/** Default ENV variables */
if (typeof process.env.NODE_ENV === 'undefined') {
  process.env.NODE_ENV = 'development';
}

if (typeof process.env.APP_ENV === 'undefined') {
  process.env.APP_ENV = 'browser';
}

if (typeof process.env.DEBUG === 'undefined') {
  process.env.DEBUG = process.env.NODE_ENV === 'development';
}

module.exports = {
  NODE_ENV: process.env.NODE_ENV,
  APP_ENV: process.env.APP_ENV,
  IS_PROD: process.env.NODE_ENV === 'production',
  IS_DEV: process.env.NODE_ENV === 'development',
  IS_BROWSER: process.env.APP_ENV === 'browser',
  IS_POS: process.env.APP_ENV === 'pos',
  IS_DEBUG: process.env.DEBUG,
  BUNDLE_NAME: `bundle.${process.env.APP_ENV}`,
};
