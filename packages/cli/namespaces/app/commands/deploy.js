const { readdirSync, existsSync } = require('fs');
const path = require('path');
const chalk = require('chalk');
const { fromCwd, getPkg } = require('quickenv');
const shell = require('../../../lib/shell.js');
const cliArgs = require('../args.js');
const { MODELS, PLATFORMS } = require('../../../consts.js');

const PKG = getPkg();

module.exports = {
  command: 'deploy',
  desc: 'Deploy the current app',
  builder: {
    force: {
      description:
        'Force to upload even unchanged ones files. Work only with rsync tool',
      default: false,
    },
    legacy: {
      default: false,
    },
    customSSH: {
      description: 'Custom SSH configuration to use with deploy command',
      alias: 's',
      default: 'POS',
    },
    tool: {
      description:
        'Define the deployer tool. You must have tool installed in your paths',
      alias: 't',
      default: 'rsync',
      choices: ['rsync', 'xcb', 'adb'],
    },
    appsFolder: {
      description:
        'Set the main app folder for deploy. Usefull for dynamic folder like 10003, 10004, etc',
      alias: 'f',
      default: '/data/app/MAINAPP/apps/', // MP35P like: /data/users/10004/apps/
    },
    args: {
      description:
        'Custom rsync args. Useful for some OS`s with differents supports. Combine with tool argument',
      alias: 'a',
      default: '',
    },
    platform: {
      description:
        'Choose the platform of deploy. Work only with rsync tool. Overrides customSSH(ds) argument if Q92. If tool is XCB, this option is ignored.',
      alias: 'p',
      default: 'S920',
      choices: [...PLATFORMS],
    },
    usage: {
      description: 'See examples',
      default: false,
      type: 'boolean',
    },
  },
  handler({
    legacy,
    force,
    customSSH,
    args,
    appsFolder: _folder,
    platform,
    tool: _tool,
    usage,
  }) {
    if (usage === true) {
      console.log(chalk.yellow(`Examples:`));
      console.log(
        `Build for MP35P: ${chalk.cyan(
          `mamba app deploy -p MP35P -f /data/users/10004/apps/`,
        )}`,
      );
      console.log(`Build with Q92: ${chalk.cyan(`mamba app deploy -p Q92`)}`);
      console.log(`Build with XCB: ${chalk.cyan(`mamba app deploy -t xcb`)}`);
      return;
    }
    const { id } = PKG.mamba;
    const appSlug = `${id}-${PKG.name}`;

    const isQ92 = platform === MODELS.Q92;
    const isPax = isQ92 || platform === MODELS.S920;
    const isMP35P = platform === MODELS.MP35P;

    const ADB_TOOL = 'adb';

    let appsFolder = _folder;

    let tool = _tool;
    if (isMP35P) tool = ADB_TOOL;

    const useAdb = tool === ADB_TOOL || isMP35P;
    const useRsync = tool === 'rsync' && !useAdb;
    const useXcb = tool === 'xcb' && !useAdb;

    let toolArgs = args;

    const command = (...rest) =>
      [tool, ...rest].filter(v => v !== '').join(' ');

    const CDW_DIST = fromCwd('dist');
    const DIST_DIR = fromCwd(legacy ? 'ui/dist' : 'dist/bundle.pos');
    const APPS_DIR = `${appsFolder}${appSlug}`;

    console.log(chalk.cyan('Deploy configuration: \n'));
    console.log(`  Platform: ${chalk.yellow(platform)}`);
    console.log(`  Tool: ${chalk.yellow(tool)}`);
    console.log(`  Arguments: ${chalk.yellow(JSON.stringify(args))}`);

    if (!useXcb) {
      console.log(`  Dist directory: ${chalk.yellow(DIST_DIR)}`);
      console.log(`  App directory: ${chalk.yellow(APPS_DIR)}\n\n`);
    }

    if (useAdb) {
      if (/MAINAPP/g.test(appsFolder) && isMP35P) {
        console.log(
          `Error: ${chalk.red(
            `Folder can't be MAINAPP for MP45P\n       Aborting\n`,
          )}`,
        );
        return;
      }
      const isValidFolder = /data\/users\/[0-9]+\/apps\//g.test(appsFolder);
      if (isValidFolder) {
        const PUSH = 'push';
        let adbCmd = command(PUSH, toolArgs, `${DIST_DIR}/.`, `${APPS_DIR}/.`);
        console.log(
          `  Deploying with: ${chalk.cyan(`${command(PUSH, toolArgs)}`)}\n\n`,
        );
        shell('adb root');
        shell(`adb shell rm -rf ${APPS_DIR}`);
        shell('sleep 1');
        shell(adbCmd);
        shell('sleep 1');
        shell(
          'adb shell ls -R /data/users/10004/apps/5-report | grep -E ".js|.html|.css|assets"',
        );
      } else {
        console.log(
          `Error: ${chalk.red(
            `Wrong folder pattern ${appsFolder}\n       Aborting\n`,
          )}`,
        );
        return;
      }
    } else if (useXcb && isPax) {
      const aupPath = `${CDW_DIST}/${appSlug}.aup`;

      let xcbCmd;
      let found = existsSync(aupPath);

      try {
        if (found) {
          xcbCmd = command('installer', 'aup', aupPath);
          console.log(`  AUP file: ${chalk.yellow(aupPath)}\n\n`);
          shell(xcbCmd);
        } else {
          throw new Error(
            `\n  ⚠️  AUP ${aupPath} not found.\n     Trying searching in folder dist...\n`,
          );
        }
      } catch (err) {
        console.log(chalk.yellow(err.message));
        const files = readdirSync(CDW_DIST);
        for (let i in files) {
          const file = files[i];
          if (path.extname(file) === '.aup') {
            found = true;
            xcbCmd = command('installer', 'aup', `${CDW_DIST}/${file}`);
            console.log(`  AUP file: ${chalk.yellow(file)}\n\n`);
            console.log(`Deploying "${appSlug}" with: \n${chalk.cyan(xcbCmd)}`);
            shell(xcbCmd);
          }
        }
        if (!found) console.log(chalk.red('  .aup not found!'));
      }
    } else {
      let sshConfig = customSSH;

      // TODO: Implement deploy for V240m
      if (isQ92) {
        sshConfig = MODELS.Q92;
        toolArgs = '-arvc';
      }

      if (toolArgs === '') {
        toolArgs = '-zzaPR';
      }

      const REMOTE_APP_DIR = `${sshConfig}:${APPS_DIR}`;
      console.log(`Deploying "${appSlug}" to "${REMOTE_APP_DIR}"`);

      let rsyncCmd = command(
        toolArgs,
        !force ? '--checksum' : '',
        '--delete',
        `${DIST_DIR}/`,
        `${REMOTE_APP_DIR}`,
      );

      shell(rsyncCmd);

      if (legacy) {
        console.log(
          `Moving "manifest.xml" and "icon.bmp" to "${REMOTE_APP_DIR}/"`,
        );

        const includes = ['manifest.xml', 'icon.bmp']
          .map(path => `--include="${path}"`)
          .join(' ');

        rsyncCmd = command(
          toolArgs,
          !force ? '--size-only' : '',
          '--delete',
          includes,
          '-exclude',
          '**/*',
          '.',
          `${REMOTE_APP_DIR}/`,
        );

        shell(rsyncCmd);
      }
    }

    console.log('App deployed');
  },
};
