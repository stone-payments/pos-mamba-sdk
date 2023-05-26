export enum CLIENT_ENVIRONMENT_MODE {
  ESLint = 'ESLint',
  Webpack = 'Webpack',
}

export enum APP_TECHNOLOGY {
  NATIVE = 0,
  WEB = 1,
}

export enum APP_TYPE {
  APPLICATION_TYPE_GENERIC_APP = 0,
}

/* Native package.json fields used in manifest.xml */
export interface NativePackageManifest {
  /**
   * Package name.
   * And the slug name of application without space or accents.
   */
  defaultName: string;

  /**
   * Package version.
   * And the application version (MAJOR.MINOR.PATCH).
   */
  appVersion: string | unknown;

  /**
   * Package description
   * And the application description to be displayed on store.
   */
  appDescription: string | unknown;

  /**
   * Package author.
   * And the application author to be displayed on store(aka publisher).
   */
  publisherName: string | unknown;
}

export interface MambaPackageField {
  // Required

  /**
   * The application identification number.
   */
  id: number;

  /**
   * The name of the app of internal backend use. Usually same of defaultName.
   * @default NativePackageManifest.defaultName
   */
  appName: string;

  /**
   * The name of the application to be displayed on the main application menu.
   * @deprecated use `appName`
   */
  displayedName?: string;

  /**
   * The application icon.
   */
  iconPath: string;

  /**
   * App creation date in ISO Date:Time format.
   */
  appCreationDate: string;

  // Optionals

  /**
   * The application type.
   * Do not change if you don't know what you are doing.
   * @default 0
   */
  appType?: number | APP_TYPE;

  /**
   * Define a value to run on a user interaction or operation. Usually a *.html file.
   */
  runOnUserSelection?: string;

  /**
   * Define a value to run on system initialization. Usually a *.html file.
   */
  runOnInit?: string;

  /**
   * If the application will or will not be displayed in main menu.
   * @default true
   */
  listInMainMenu?: boolean;

  /**
   * If application should keep running in background or not.
   */
  keepInBackground?: boolean;

  /**
   * The application technology.
   * Do not change if you don't know what you are doing.
   * @default
   * APP_TECHNOLOGY.WEB
   */
  appTechnology?: APP_TECHNOLOGY;

  /**
   * The publisher id.
   * Do not change if you don't know what you are doing.
   */
  publisherId?: number;

  /**
   * App last modification date in ISO Date:Time format.
   */
  appLastModificationDate?: string;

  /**
   * return the password protection level of a application.
   * Do not change if you don't know what you are doing.
   * @default 0
   */
  appPasswordProtectionLevel?: number;

  /**
   * Defines whether the application is auto initiable.
   * @default false
   */
  autoInitiable?: boolean;

  /**
   * Enable proxy to make requests through mobile broadband.
   * You also need a proper `appKey` to use this property.
   */
  proxyEnabled?: boolean;

  /**
   * Application key that allows make requests on mobile broadband.
   */
  appKey: string;

  /**
   * If the application is allowed to make transactions with a different StoneCode.
   */
  differentScTransacionAllowed?: boolean;

  /**
   * Semicolon separated features
   * @example
   * "EXTENDED_PROBE_ENABLED;PIX_ENABLED"
   */
  supportedFeatures?: string;

  /**
   * Array of models to disable built-in screen zoom factor
   * @example
   * ["MP35P, MP35"]
   */
  disableZoomFactor?: string[];

  // other options can exist
  [any: string]: unknown;
}

export interface PackagePrediction extends NativePackageManifest {
  name: string;
  mamba: MambaPackageField;
  module: string;
  svelte: string;
  esnext: string;
  main: string;
  rootDir: string;
  [any: string]: unknown;
}
