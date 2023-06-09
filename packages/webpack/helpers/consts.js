const { env } = process;

/** Default ENV variables */
if (typeof env.NODE_ENV === 'undefined') {
  env.NODE_ENV = 'development';
}

/** Debug level. false, 1, 2 */
if (typeof env.DEBUG_LVL === 'undefined') {
  env.DEBUG_LVL = 'false';
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

if (typeof env.SDK_ASSETS_FOLDER === 'undefined') {
  env.SDK_ASSETS_FOLDER = '@mamba';
}

if (typeof env.ORG_ASSETS_FOLDER === 'undefined') {
  env.ORG_ASSETS_FOLDER = 'assets/org';
}

module.exports = {
  ORG_ASSETS_FOLDER: env.ORG_ASSETS_FOLDER,
  SDK_ASSETS_FOLDER: env.SDK_ASSETS_FOLDER,
  NODE_ENV: env.NODE_ENV,
  APP_ENV: env.APP_ENV,
  IS_PROD: env.NODE_ENV === 'production',
  IS_DEV: env.NODE_ENV === 'development',
  DEBUG_LVL: env.DEBUG_LVL,
  IS_BROWSER: env.APP_ENV === 'browser',
  IS_POS: env.APP_ENV === 'pos',
  BUNDLE_NAME: `bundle.${env.APP_ENV}`,
  ADD_MAMBA_SIMULATOR: env.MAMBA_SIMULATOR === 'true',
  WEINRE_IP: env.WEINRE_IP,
  REMOTEJS: env.REMOTEJS,
  HTML_BASE_URL: env.HTML_BASE_URL,
};
