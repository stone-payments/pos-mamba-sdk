const {
  runCmd,
} = require('../../../utils.js');

const config = require('../buildConfig.json');

const params = config.platforms.pax;
const apps = config.apps;
const qtPath = `$MAMBA/${params.qt_dir}`;
const sysRoot = `$MAMBA/${params.sysroot}`;
const qtMkConf = `$MAMBA/${params.mkspecs}`;
const destDir = '$MAMBA/deploy';

module.exports = {
  command: 'build',
  desc: 'Build MambaOS. Defaults to debug mode',
  builder: {
    production: {
      description: 'Build for release pourpose, logs are disabled.',
      default: false,
      alias: ['p', 'production'],
    },
    lib: {
      description: 'Build only the .pro file at the path passed.',
      type: 'string',
      default: 'MAMBA.pro',
      alias: ['l', 'lib'],
    },
    clean: {
      description: 'Clears before building.',
      default: false,
      alias: ['clean'],
    },
  },
  handler({
    production,
    lib,
    clean,
  }) {
    console.log('Building Mamba System');

    /** Set compiler PATH */
    process.env.PATH += `:${process.env.MAMBA}/${params.toolchain}`;
    /** setup environment  variables */
    runCmd(['cd $MAMBA', `${qtPath}/bin/qmake -set QT_SYSROOT ${sysRoot}`]);

    /** Build project */
    runCmd([
      'cd $MAMBA',
      `${qtPath}/bin/qmake ${lib} -r -spec ${qtMkConf} ${
        production ? '' : 'CONFIG+=debug'
      }`,
    ]);

    if (clean) {
      /** Make Clean */
      runCmd(['cd $MAMBA', 'make clean', 'make -j$(nproc)']);

      /** Generate DB Files and Copying Files */
      console.log('Building Mamba Database');
      runCmd(['cd $MAMBA/sys/db',
        './generateDb.sh',
        `mkdir -p ${destDir}/sys && mkdir ${destDir}/sys/db && mkdir ${destDir}/sys/db/scripts`,
        `cp -Ru $MAMBA/sys/db/*.db ${destDir}/sys/db/`,
        `cp -Ru $MAMBA/sys/db/data/stats/stats.sql ${destDir}/sys/db/scripts`,
        `cp -Ru $MAMBA/sys/db/data/system/system.sql ${destDir}/sys/db/scripts`,
        `cp -Ru $MAMBA/sys/db/data/transac/transac.sql ${destDir}/sys/db/scripts`,
      ]);

    } else {
      runCmd(['cd $MAMBA', 'make -j$(nproc)']);
    }


    /** Move files to destDir */
    runCmd(['cd $MAMBA', 'make install']);

    /** Copy Qt and Mamba Lib Files */
    runCmd(
      [
        'cd $MAMBA',
        `cp -Ru builds/PAX_S920/* ${destDir}`,
        `cp -Ru builds/PAX_S920/lib/* ${destDir}/lib`,
        `cp -Ru ${qtPath}/lib/*.so* ${destDir}/lib`,
        `cp -Ru ${qtPath}/plugins ${destDir}`,
        `cp -Ru ${qtPath}/imports ${destDir}`,
        `cp -Ru $MAMBA/sdk/linux/PAX/S920/sysroot/usr/lib/*.so ${destDir}/lib`,
        `cp -Ru $MAMBA/sdk/linux/PAX/S920/sysroot/lib/libsqlite3* ${destDir}/lib/`,
        `cp -Ru $MAMBA/sdk/linux/PAX/S920/sysroot/lib/libqjson* ${destDir}/lib/`,
        `cp -Ru $MAMBA/sdk/linux/PAX/S920/sysroot/lib/libstdc++* ${destDir}/lib/`,
      ], {
        exit: false,
      },
    );

    /** Copy Config File */
    runCmd([`cp -r $MAMBA/kernel/MAMBA_PAYMENT_NEW/config/ ${destDir}`]);

    /** Copy Static Files to Deploy Folder */
    runCmd([
      `mkdir -p ${destDir}`,
      `cp -u $MAMBA/res/images/1x/* ${destDir}/res`,
      `cp -Ru $MAMBA/res/images/2x/* ${destDir}/res`,
      `cp -Ru $MAMBA/res/images/receipts/* ${destDir}/res`,
      `cp -Ru $MAMBA/res/images/statusbar ${destDir}/res`,
      `cp -Ru $MAMBA/res/images/statusbar/* ${destDir}/res`,
      `cp -Ru $MAMBA/res/fonts ${destDir}/lib`,
      `cp -Ru $MAMBA/sys/certs ${destDir}/sys`,
      `cp -Ru $MAMBA/sys/PAX_S920/* ${destDir}/sys`,
    ], {
      exit: false,
    });

    /** Move Apps to Deploy Folder */
    runCmd([`mkdir ${destDir}/apps`], {
      exit: false,
    });
    apps.forEach(app => {
      runCmd(
        [
          'cd $MAMBA',
          `mkdir -p ${destDir}/apps/${app.dest}`,
          `cp -Ru apps/native${app.dist}/* ${destDir}/apps/${app.dest}`,
        ], {
          exit: false,
        });

      if (app.icon) {
        runCmd([`cp -u $MAMBA/apps/native${app.icon} ${destDir}/apps/${app.dest}`]);
      }

      if (app.manifest) {
        runCmd([`cp -u $MAMBA/apps/native${app.manifest} ${destDir}/apps/${app.dest}`]);
      }

      if (app.lib) {
        runCmd([`cp -u $MAMBA/apps/native${app.lib} ${destDir}/apps/${app.dest}`]);
      }

    });



    console.log('Mamba Build Done!');
  },
};
