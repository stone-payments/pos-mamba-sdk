const { env } = process;

/** Default ENV variables */
if (typeof env.NODE_ENV === 'undefined') {
  env.NODE_ENV = 'development';
}

if (typeof env.APP_ENV === 'undefined') {
  env.APP_ENV = 'browser';
}

if (typeof env.MAMBA_SIMULATOR === 'undefined') {
  env.MAMBA_SIMULATOR = 'false';
}

if (env.APP_ENV === 'browser') {
  env.MAMBA_SIMULATOR = 'true';
}

module.exports = {
  NODE_ENV: env.NODE_ENV,
  APP_ENV: env.APP_ENV,
  IS_PROD: env.NODE_ENV === 'production',
  IS_DEV: env.NODE_ENV === 'development',
  IS_BROWSER: env.APP_ENV === 'browser',
  IS_POS: env.APP_ENV === 'pos',
  BUNDLE_NAME: `bundle.${env.APP_ENV}`,
  ADD_MAMBA_SIMULATOR: env.MAMBA_SIMULATOR === 'true',
};
