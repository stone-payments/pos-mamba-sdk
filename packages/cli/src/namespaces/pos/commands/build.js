const readline = require('readline');
const { writeFile } = require('fs');
const { EOL } = require('os');
const { resolve } = require('path');

const { shell } = require('../../../utils.js');

const config = require('../buildConfig.json');

const platformParams = config.platforms.pax;
const { apps } = config;

const MAMBA_DIR = process.env.MAMBA;
const fromMamba = (...paths) => resolve(MAMBA_DIR, ...paths);

const QT_DIR = fromMamba(platformParams.qt_dir);
const SYS_ROOT_DIR = fromMamba(platformParams.sysroot);
const QT_MK_CONF_DIR = fromMamba(platformParams.mkspecs);
const DIST_DIR = fromMamba('deploy');

const SRC_APP_DIR = fromMamba('apps', 'native');
const SRC_DB_DIR = fromMamba('sys', 'db');

const DIST_LIB_DIR = fromMamba(DIST_DIR, 'lib');
const DIST_APP_DIR = resolve(DIST_DIR, 'apps');
const DIST_DB_DIR = resolve(DIST_DIR, 'sys', 'db');
const DIST_DB_SCRIPTS_DIR = resolve(DIST_DB_DIR, 'scripts');

module.exports = {
  command: 'build',
  desc: 'Build MambaOS. Defaults to debug mode',
  builder: {
    production: {
      description: 'Build for release purpose, logs are disabled.',
      default: false,
      alias: ['p'],
    },
    lib: {
      description: 'Build only the .pro file at the specified path.',
      type: 'string',
      default: 'MAMBA.pro',
      alias: ['l'],
    },
    vendor: {
      description: 'POS manufacturer',
      type: 'string',
      alias: 'v',
      default: 'PAX',
    },
    model: {
      description: 'POS model name',
      type: 'string',
      default: 'S920',
    },
    clean: {
      description: 'Make a clean build',
      default: false,
    },
  },
  // eslint-disable-next-line
  handler({ production, lib, clean, vendor, model }) {
    console.log('Building Mamba System');

    /** Set compiler PATH */
    process.env.PATH += `:${fromMamba(platformParams.toolchain)}`;

    shell.cd(MAMBA_DIR);

    shell(`mkdir -p ${DIST_DIR}`);

    /** Setup environment variables and build project */
    shell([
      `${QT_DIR}/bin/qmake -set QT_SYSROOT ${SYS_ROOT_DIR}`,
      `${QT_DIR}/bin/qmake ${lib} -r -spec ${QT_MK_CONF_DIR} ${
        production ? '' : 'CONFIG+=debug'
      }`,
      clean && 'make clean',
      'make -j$(nproc)',
    ]);

    /** Generate DB Files and copy it's files to the dist directory */
    if (clean) {
      console.log('Building Mamba Database');

      shell(`mkdir -p ${DIST_DB_SCRIPTS_DIR}`);

      shell('./generateDb.sh', {
        quiet: true,
        cwd: SRC_DB_DIR,
      }); // todo: flags

      shell.rsync('sys/db/*.db', `${DIST_DB_DIR}/`);

      shell.rsync(
        'sys/db/data/{stats/stats,system/system,transac/transac}.sql',
        `${DIST_DB_SCRIPTS_DIR}/`,
      );
    }

    /** Move files to dist dir */
    shell('make install', { quiet: true });

    /** Copy Qt and Mamba Lib Files */
    const libFiles = [
      [`builds/${platformParams.name}/*`, DIST_DIR],
      [`${QT_DIR}/{plugins,imports}`, DIST_DIR],
      [`${QT_DIR}/lib/*.so*`, DIST_LIB_DIR],
      [`builds/${platformParams.name}/lib/*`, DIST_LIB_DIR],
      [`sdk/linux/${vendor}/${model}/sysroot/usr/lib/libssl.so`, DIST_LIB_DIR],
      [`sdk/linux/${vendor}/${model}/sysroot/lib/libsqlite3.so*`, DIST_LIB_DIR],
      [`sdk/linux/${vendor}/${model}/sysroot/lib/libqjson.so*`, DIST_LIB_DIR],
      [`sdk/linux/${vendor}/${model}/sysroot/lib/libqjs.so*`, DIST_LIB_DIR],
      [`sdk/linux/${vendor}/${model}/sysroot/lib/libstdc++*`, DIST_LIB_DIR],
      [`sdk/linux/${vendor}/${model}/sysroot/lib/libF*`, DIST_LIB_DIR],
      [`sdk/linux/${vendor}/${model}/sysroot/lib/libD*`, DIST_LIB_DIR],
    ];

    libFiles.forEach(([src, tgt]) =>
      shell.rsync(src, `${tgt}/`, { checksum: true }),
    );

    /** Copy Config File */
    shell.rsync('kernel/MAMBA_PAYMENT_NEW/config', `${DIST_DIR}/`);

    /** Copy Static Files to dist directory */
    shell(`mkdir -p ${DIST_DIR}/res/merchants`);

    const staticFiles = [
      [`res/fonts`, `${DIST_LIB_DIR}`],
      [`res/style.*`, `${DIST_DIR}/res`],
      [`res/images/{1x,2x,receipts,statusbar}/*`, `${DIST_DIR}/res`],
      [`sys/certs`, `${DIST_DIR}/sys`],
      [`sys/${vendor}_${model}/*`, `${DIST_DIR}/sys`],
    ];

    staticFiles.forEach(([src, tgt]) =>
      shell.rsync(src, `${tgt}/`, { checksum: true }),
    );

    /** Move Apps to dist dir */
    shell(`mkdir -p ${DIST_APP_DIR}`, { exit: false });

    apps.forEach(appInfo => {
      const { dist, icon, manifest, lib: appLib } = appInfo;
      let { srcDir, remoteDir } = appInfo;

      srcDir = resolve(SRC_APP_DIR, srcDir);
      remoteDir = resolve(DIST_APP_DIR, remoteDir);

      shell(`mkdir -p ${remoteDir}`);

      shell.rsync(resolve(srcDir, dist, '*'), `${remoteDir}/`, {
        exit: false,
        checksum: true,
      });

      if (icon) {
        shell.rsync(resolve(srcDir, icon), `${remoteDir}/`, { checksum: true });
      }

      if (manifest) {
        shell.rsync(resolve(srcDir, manifest), `${remoteDir}/`, {
          checksum: true,
        });
      }

      if (appLib) {
        shell.rsync(resolve(srcDir, appLib), `${remoteDir}/`, {
          checksum: true,
        });
      }
    });

    /** Ask for Mamba version */
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question('\nPlease, type Mamba System Version [x.x.x]:\n', answer => {
      const mambaVersion = answer.match(/\d\.\d\.\d/) ? answer : '1.0.0';

      const APP_INFO_CONTENT = [
        `[app]`,
        `name=StoneMambaLoader`,
        `bin=StoneMambaLoader`,
        `artwork=`,
        `desc=Mamba System Application`,
        `vender=PAX`,
        `version=${mambaVersion}`,
      ].join(EOL);

      writeFile(
        resolve(DIST_DIR, 'appinfo'),
        APP_INFO_CONTENT + EOL,
        'UTF-8',
        error => {
          if (error) {
            console.log(error);
            console.log('Appinfo file could not be written.');
          }
        },
      );

      console.log('Mamba Build Done!');

      rl.close();
    });
  },
};
