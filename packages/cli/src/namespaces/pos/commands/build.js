const {
  runCmd,
} = require('../../../utils.js');

const config = require('../buildConfig.json');

const params = config.platforms.pax;
const qtPath = `$MAMBA/${params.qt_dir}`;
const sysRoot = `$MAMBA/${params.sysroot}`;
const qtMkConf = `$MAMBA/${params.mkspecs}`;
const destDir = '$MAMBA/deploy';

module.exports = {
  command: 'build',
  desc: 'Build MambaOS. Defaults to debug mode',
  builder: {
    release: {
      description: 'Build for release propose, logs are disabled.',
      default: false,
      alias: ['r'],
    },
    lib: {
      description: 'Build only the .pro file at the path passed.',
      type: 'string',
      default: 'MAMBA.pro',
      alias: ['l', '--lib'],
    },
    clean: {
      description: 'Clears before building.',
      default: false,
      alias: ['--clean'],
    },
  },
  handler({
    release,
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
        release ? '' : 'CONFIG+=debug'
      }`,
    ]);

    if (clean) {
      runCmd(['cd $MAMBA', 'make clean', 'make -j$(nproc)']);
    } else {
      runCmd(['cd $MAMBA', 'make -j$(nproc)']);
    }

    /** Generate DB Files */
    console.log('Building Mamba Database');
    runCmd(['cd $MAMBA/sys/db', './generateDb.sh']);

    /** Move files to destDir */
    runCmd(['cd $MAMBA', 'make install']);

    /** Copy Qt Files */
    runCmd(
      [
        'cd $MAMBA',
        `cp ${qtPath}/lib/*.so* ${destDir}/lib`,
        `cp ${qtPath}/plugins ${destDir}`,
        `cp ${qtPath}/imports ${destDir}`,
      ], {
        exit: false,
      },
    );

    console.log('Mamba Build Done!');
  },
};
