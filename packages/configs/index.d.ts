declare module '@mamba/configs/envModes.cjs' {
  const NODE_ENV: string | undefined;
  const WEINRE_IP: string | undefined;
  const IS_STORYBOOK: boolean | undefined;
  const APP_ENV: string | undefined;
  const SDK_ASSETS_FOLDER: string | undefined;
  const ORG_ASSETS_FOLDER: string | undefined;
  const HTML_BASE_URL: string | undefined;
  const DEBUG_LVL: number | undefined;
  const BUNDLE_NAME: string | undefined;
  const ADD_MAMBA_SIMULATOR: boolean;
  const IS_PROD: boolean;
  const IS_DEV: boolean;
  const IS_BROWSER: boolean;
  const IS_POS: boolean;
  const IS_WATCHING: () => boolean;
  const IS_TEST: () => boolean;

  export {
    NODE_ENV,
    WEINRE_IP,
    IS_STORYBOOK,
    APP_ENV,
    SDK_ASSETS_FOLDER,
    ORG_ASSETS_FOLDER,
    HTML_BASE_URL,
    DEBUG_LVL,
    BUNDLE_NAME,
    ADD_MAMBA_SIMULATOR,
    IS_PROD,
    IS_DEV,
    IS_BROWSER,
    IS_POS,
    IS_WATCHING,
    IS_TEST,
  };
}
