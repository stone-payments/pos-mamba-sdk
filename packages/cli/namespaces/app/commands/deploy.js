/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
const { readdirSync, existsSync } = require('fs');
const path = require('path');
const os = require('os');
const pico = require('picocolors');
const { fromWorkingDir, getPackage } = require('@mamba/utils');
const shell = require('../../../lib/shell.js');

// const cliArgs = require('../args.js');
const { MODELS, PLATFORMS } = require('../../../consts.js');

const PKG = getPackage();

module.exports = {
  command: 'deploy',
  desc: 'Deploy the current app',
  builder: {
    force: {
      description: 'Force to upload even unchanged ones files. Work only with rsync tool',
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
      description: 'Define the deployer tool. You must have tool installed in your paths',
      alias: 't',
      default: 'rsync',
      choices: ['rsync', 'xcb', 'adb'],
    },
    appsFolder: {
      description:
        'Set the main app folder for deploy. Usefull for dynamic folder like 10003, 10004, flash, etc',
      alias: 'f',
      default: '', // MP35P like: /data/users/10004/apps/
    },
    args: {
      description:
        'Custom tool args. Useful for some OS`s with differents supports. Combine with tool argument',
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
  handler({ legacy, force, customSSH, args, appsFolder: _folder, platform, tool: _tool, usage }) {
    if (usage === true) {
      console.log(pico.yellow(`\n  Examples:\n`));
      console.log(
        `    Build for MP35(P): ${pico.cyan(
          `mamba app deploy -p MP35P -f /data/users/10004/apps/`,
        )}\n`,
      );
      console.log(`    Build with Q92: ${pico.cyan(`mamba app deploy -p Q92`)}\n`);
      console.log(`    Build with XCB: ${pico.cyan(`mamba app deploy -t xcb`)}\n`);
      return;
    }
    const { id } = PKG.mamba;
    const appSlug = `${id}-${PKG.name}`;

    const isQ92 = platform === MODELS.Q92;
    const isQ92S = platform === MODELS.Q92S;
    const isD199 = platform === MODELS.D199;
    const isD195 = platform === MODELS.D195;
    const isD230 = platform === MODELS.D230;
    const isQ60 = platform === MODELS.Q60;
    const isPax = isQ92 || isD199 || isD195 || isD230 || isQ60 || platform === MODELS.S920;
    const isGertec = platform === MODELS.MP35P || platform === MODELS.MP35;
    const isVerifone = platform === MODELS.V240M;

    const ADB_TOOL = 'adb';
    const SCP_TOOL = 'scp';

    let appsFolder = _folder;

    if (appsFolder === '') {
      if (isVerifone) {
        appsFolder = '/home/usr1/flash/apps/';
      } else {
        // PAX pattern
        appsFolder = '/data/app/MAINAPP/apps/';
      }
    }

    let tool = _tool;
    if (isGertec) tool = ADB_TOOL;
    if (isVerifone) tool = SCP_TOOL;

    const useAdb = tool === ADB_TOOL || isGertec;

    // const useRsync = tool === 'rsync' && !useAdb;
    const useXcb = tool === 'xcb' && !useAdb;
    const useScp = tool === SCP_TOOL || isVerifone;

    let toolArgs = args;

    const command = (...rest) => [tool, ...rest].filter((v) => v !== '').join(' ');

    const CDW_DIST = fromWorkingDir('dist');
    const DIST_DIR = fromWorkingDir(legacy ? 'ui/dist' : 'dist/bundle.pos');
    const APPS_DIR = `${appsFolder}${appSlug}`;

    console.log(pico.cyan('Deploy configuration: \n'));
    console.log(`  Platform: ${pico.yellow(platform)}`);
    console.log(`  Tool: ${pico.yellow(tool)}`);
    console.log(`  Arguments: ${pico.yellow(JSON.stringify(args))}`);

    if (!useXcb) {
      console.log(`  Dist directory: ${pico.yellow(DIST_DIR)}`);
      console.log(`  App directory: ${pico.yellow(APPS_DIR)}\n\n`);
    }

    if (useScp) {
      let sshConfig = customSSH;
      sshConfig = MODELS.V240M;

      console.log(`  Deploying with: ${pico.cyan(`${command(toolArgs)}`)}\n\n`);
      shell(`ssh ${sshConfig} "rm -rf ${APPS_DIR}"`);
      shell('sleep 1');

      const REMOTE_APP_DIR = `${sshConfig}:${APPS_DIR}`;

      if (toolArgs === '') {
        toolArgs = '-r -P 8888';
      }

      const scpCmd = command(toolArgs, `${DIST_DIR}/`, `${REMOTE_APP_DIR}`);

      console.log(pico.dim(`Deploying with: \n${pico.cyan(scpCmd)}\n`));
      console.log(`Deploying "${appSlug}" to "${REMOTE_APP_DIR}"`);

      shell(scpCmd);
    } else if (useAdb) {
      if (/MAINAPP/g.test(appsFolder) && isGertec) {
        console.log(`Error: ${pico.red(`Folder can't be MAINAPP for MP45P\n       Aborting\n`)}`);
        return;
      }
      const isValidFolder = /data\/users\/[0-9]+\/apps\//g.test(appsFolder);
      if (isValidFolder) {
        const PUSH = 'push';
        const adbCmd = command(PUSH, toolArgs, `${DIST_DIR}/.`, `${APPS_DIR}/.`);
        console.log(`  Deploying with: ${pico.cyan(`${command(PUSH, toolArgs)}`)}\n\n`);
        shell('adb root');
        shell(`adb shell rm -rf ${APPS_DIR}`);
        shell('sleep 1');
        shell(adbCmd);
        shell('sleep 1');
        shell(
          `adb shell ls -R ${APPS_DIR} | grep -E ".js|.html|.css|assets|.xml|.jpg|.jpeg|.svg|.png|.gif"`,
        );
      } else {
        console.log(`Error: ${pico.red(`Wrong folder pattern ${appsFolder}\n       Aborting\n`)}`);
        return;
      }
    } else if (useXcb && isPax) {
      const aupPath = `${CDW_DIST}/${appSlug}.aup`;

      let xcbCmd;
      let found = existsSync(aupPath);

      try {
        if (found) {
          xcbCmd = command('installer', 'aup', aupPath);
          console.log(`  AUP file: ${pico.yellow(aupPath)}\n\n`);
          shell(xcbCmd);
        } else {
          throw new Error(
            `\n  ⚠️  AUP ${aupPath} not found.\n     Trying searching in folder dist...\n`,
          );
        }
      } catch (err) {
        console.log(pico.yellow(err.message));
        const files = readdirSync(CDW_DIST);
        for (const i in files) {
          const file = files[i];
          if (path.extname(file) === '.aup') {
            found = true;
            xcbCmd = command('installer', 'aup', `${CDW_DIST}/${file}`);
            console.log(`  AUP file: ${pico.yellow(file)}\n\n`);
            console.log(`Deploying "${appSlug}" with: \n${pico.cyan(xcbCmd)}`);
            shell(xcbCmd);
          }
        }

        if (!found) console.log(pico.red('  .aup not found!'));
      }
    } else {
      let sshConfig = customSSH;

      // TODO: Implement deploy for V240m
      if (isQ92) sshConfig = MODELS.Q92;
      if (isQ92S) sshConfig = MODELS.Q92S;
      if (isD199) sshConfig = MODELS.D199;
      if (isD195) sshConfig = MODELS.D195;
      if (isD230) sshConfig = MODELS.D230;
      if (isQ60) sshConfig = MODELS.Q60;

      if (toolArgs === '') {
        const defaultsArgs = os.platform() === 'darwin' ? '-arvc' : '-zzaP';
        toolArgs = legacy ? '-zzaPR' : defaultsArgs;
      }

      const REMOTE_APP_DIR = `${sshConfig}:${APPS_DIR}`;

      let rsyncCmd = command(
        toolArgs,
        !force ? '--checksum' : '',
        '--delete',
        `${DIST_DIR}/`,
        `${REMOTE_APP_DIR}`,
      );

      console.log(pico.dim(`Deploying with: \n${pico.cyan(rsyncCmd)}\n`));
      console.log(`Deploying "${appSlug}" to "${REMOTE_APP_DIR}"`);

      shell(rsyncCmd);

      if (legacy) {
        console.log(`Moving "manifest.xml" and "icon.bmp" to "${REMOTE_APP_DIR}/"`);

        const includes = ['manifest.xml', 'icon.bmp'].map((p) => `--include="${p}"`).join(' ');

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
