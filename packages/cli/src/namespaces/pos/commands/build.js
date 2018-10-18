const { runCmd } = require('../../../utils.js');

const config = require('../buildConfig.json');

const params = config.platforms.pax;
const qtPath = `$MAMBA/${params.qt_dir}`;
const sysRoot = `$MAMBA/${params.sysroot}`;
const qtMkConf = `$MAMBA/${params.mkspecs}`;
const destDir = '$MAMBA/deploy';

module.exports = {
  command: 'build',
  desc: 'Build MambaOS using the flags release (-r) or debug (-d)',
  builder: {
    release: {
      description: 'Build for release propose, logs are disabled.',
      default: false,
      alias: ['r'],
    },
  },
  handler({ release }) {
    console.log('Building Mamba System');

    /** Set compiler PATH */
    process.env.PATH += `:${process.env.MAMBA}/${params.toolchain}`;
    /** setup environment  variables */
    runCmd(['cd $MAMBA', `${qtPath}/bin/qmake -set QT_SYSROOT ${sysRoot}`]);

    /** Build project */
    runCmd([
      'cd $MAMBA',
      `${qtPath}/bin/qmake MAMBA.pro -r -spec ${qtMkConf} ${
        release ? '' : 'CONFIG+=debug'
      }`,
    ]);
    runCmd(['cd $MAMBA', 'make clean', 'make -j$(nproc)']);

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
      ],
      {
        exit: false,
      },
    );

    console.log('Mamba Build Done!');
  },
};
