import xmlBuilder from 'xmlbuilder';
import { Compilation, Compiler, sources } from 'webpack';
import getPackage from '../helpers/getPackage';

const PKG = getPackage();

enum APP_TECHNOLOGY {
  NATIVE = 0,
  WEB = 1,
}

enum APP_TYPE {
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

export type ManifestXml = MambaPackageField & NativePackageManifest;

export const DEFAULT_NAME_MAX_LENGHT = 24;
export const DISPLAYED_NAME_MAX_LENGHT = 24;

/**
 * MambaManifestPlugin
 */
export default class MambaManifestPlugin {
  static defaultOptions = {
    outputFile: 'manifest.xml',
  };

  name: string = MambaManifestPlugin.name;

  options: Record<string, unknown>;

  constructor(options = {}) {
    this.options = { ...MambaManifestPlugin.defaultOptions, ...options };
  }

  static createManifestObject() {
    if (String(PKG.name).length > DEFAULT_NAME_MAX_LENGHT) {
      throw new Error(`Property "name" must have ${DEFAULT_NAME_MAX_LENGHT} character maximum.`);
    }

    if (!('version' in PKG)) throw new Error('No "version" field in package.json');
    if (!('mamba' in PKG)) throw new Error('No mamba field in package.json');
    if (typeof PKG.mamba !== 'object') {
      throw new Error('No mamba field in package.json');
    }

    const MambaField = PKG.mamba as MambaPackageField;

    if (!('id' in MambaField)) throw new Error('No "id" field in "mamba" field on package.json');
    if (!('appName' in MambaField)) {
      throw new Error('No "appName" field in "mamba" field on package.json');
    }

    if (String(MambaField.appName).length > DISPLAYED_NAME_MAX_LENGHT) {
      throw new Error(
        `Property "appName" must have ${DISPLAYED_NAME_MAX_LENGHT} character maximum.`,
      );
    }

    if (!('iconPath' in MambaField)) {
      throw new Error('No "iconPath" field in "mamba" field on package.json');
    }

    if (!('appCreationDate' in MambaField)) {
      throw new Error('No "appCreationDate" field in "mamba" field on package.json');
    }

    const date = new Date();

    /** Align the date with POS timezone */
    date.setHours(
      date.getHours() - date.getTimezoneOffset() / 60,
      date.getMinutes(),
      date.getSeconds(),
      0,
    );

    const nativeManifestInfo: NativePackageManifest = {
      defaultName: PKG.name,
      appVersion: PKG.version,
      appDescription: 'description' in PKG ? PKG.description : '',
      publisherName: 'author' in PKG ? PKG.author : '',
    };

    const isoDate = date.toISOString();

    const manifest: ManifestXml = {
      ...MambaField,
      ...nativeManifestInfo,
      id: MambaField.id,
      appName: nativeManifestInfo.defaultName,
      displayedName: MambaField.appName,
      appType:
        typeof MambaField.appType === 'number'
          ? MambaField.appType
          : APP_TYPE.APPLICATION_TYPE_GENERIC_APP,
      runOnUserSelection:
        typeof MambaField.runOnUserSelection === 'string'
          ? MambaField.runOnUserSelection
          : 'index.html',
      listInMainMenu:
        typeof MambaField.listInMainMenu === 'boolean' ? MambaField.listInMainMenu : true,
      appTechnology:
        MambaField.appTechnology === APP_TECHNOLOGY.WEB ||
        MambaField.appTechnology === APP_TECHNOLOGY.NATIVE
          ? MambaField.appTechnology
          : APP_TECHNOLOGY.WEB,
      appCreationDate: MambaField.appCreationDate,
      appLastModificationDate: isoDate.slice(0, isoDate.length - 5),
      appPasswordProtectionLevel:
        typeof MambaField.appPasswordProtectionLevel === 'number'
          ? MambaField.appPasswordProtectionLevel
          : 0,
    };

    if (typeof MambaField.runOnInit === 'string') manifest.runOnInit = MambaField.runOnInit;
    if (typeof MambaField.keepInBackground === 'boolean') {
      manifest.keepInBackground = MambaField.keepInBackground;
    }

    if (typeof MambaField.publisherId === 'number') manifest.publisherId = MambaField.publisherId;
    if (typeof MambaField.autoInitiable === 'boolean') {
      manifest.autoInitiable = MambaField.autoInitiable;
    }

    if (typeof MambaField.appKey === 'string') manifest.appKey = MambaField.appKey;
    if (typeof MambaField.proxyEnabled === 'boolean') {
      manifest.proxyEnabled = MambaField.proxyEnabled;
    }

    if (typeof MambaField.differentScTransacionAllowed === 'boolean') {
      manifest.differentScTransacionAllowed = MambaField.differentScTransacionAllowed;
    }

    if (typeof MambaField.supportedFeatures === 'string') {
      manifest.supportedFeatures = MambaField.supportedFeatures;
    }

    if ('disableZoomFactor' in MambaField && Array.isArray(MambaField.disableZoomFactor)) {
      manifest.disableZoomFactor = MambaField.disableZoomFactor;
    }

    return manifest;
  }

  static transformEntriesToXmlFields(manifestObject: ManifestXml) {
    if (!manifestObject) throw new Error('Invalid manifest object');

    return Object.entries(manifestObject).map(([name, text]) => ({
      '@Name': name,
      '#text': text,
    }));
  }

  static buildManifestXml(
    entries: {
      '@Name': string;
      '#text': unknown;
    }[],
  ) {
    return xmlBuilder
      .create(
        {
          MambaClass: {
            '@Type': 'Manifest',
            '@Version': '1.0',
            Member: entries,
          },
        },
        { headless: true },
      )
      .end({ pretty: true });
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler: Compiler) {
    compiler.hooks.thisCompilation.tap(this.name, (compilation: Compilation) => {
      const manifestObject = MambaManifestPlugin.createManifestObject();
      const manifestEntries = MambaManifestPlugin.transformEntriesToXmlFields(manifestObject);
      const xmlManifest = MambaManifestPlugin.buildManifestXml(manifestEntries);

      compilation.hooks.processAssets.tap(
        {
          name: this.name,
          stage: Compilation.PROCESS_ASSETS_STAGE_SUMMARIZE,
        },
        () => {
          if (typeof this.options.outputFile !== 'string') return;
          compilation.emitAsset(this.options.outputFile, new sources.RawSource(xmlManifest), {
            size: xmlManifest.length,
          });
        },
      );
    });
  }
}
