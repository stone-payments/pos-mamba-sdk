/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint no-console: 0 */
import readline from 'node:readline';
import path, { delimiter as osDelimiter } from 'node:path';
import * as webpack from 'webpack';
import pico from 'picocolors';
import { createColorize } from 'colorize-template';
import prettyTime from 'pretty-time';
import { HOST, PORT } from '../helpers/constants';
import LogUpdate from './logUpdate';

const c = createColorize({
  ...pico,
});

const { dim, blue, bold } = pico;

const COLLEFT_LENGTH = 19;
const MAX_LINE_LENGTH = 57;
const MAX_URL_LENGTH = 28;
const BAR_LENGTH = MAX_LINE_LENGTH - (COLLEFT_LENGTH + 15);
const CROSS = '✘';
const BLOCK_BG = pico.dim('░');
const BLOCK_FG = '█';
const CORNER_LEFT = '|';
const CORNER_RIGHT = '|';
const NEXT = pico.blue('›');
const LPAD = '  ';
const TICK = '✔';
const CIRCLE_OPEN = '◯';
const LINE = dim(blue('─'.repeat(MAX_LINE_LENGTH)));
const NODE_MODULES = `${osDelimiter}node_modules${osDelimiter}`;
const onlyTextRegx =
  // eslint-disable-next-line no-control-regex
  /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g;

/**
  ███╗   ███╗ █████╗ ███╗   ███╗██████╗  █████╗
  ████╗ ████║██╔══██╗████╗ ████║██╔══██╗██╔══██╗
  ██╔████╔██║███████║██╔████╔██║██████╔╝███████║
  ██║╚██╔╝██║██╔══██║██║╚██╔╝██║██╔══██╗██╔══██║
  ██║ ╚═╝ ██║██║  ██║██║ ╚═╝ ██║██████╔╝██║  ██║

  Mamba infrastructure looger for webpack:

  MAMBA SDK  compiled successfully in 1.32s

  Project is running at:

  ◼︎ Local                         ➜ http://localhost:8080/
  ─────────────────────────────────────────────────────────
  ◼︎ Network             ➜ IPv4: http://192.168.50.51:8080/
                        ➜ IPv6:     http://[fe80::1]:8080/

  ─────────────────────────────────────────────────────────
  ◯ building              (46%) ▏▓▓▓▓▓▓▓▓▓                ▕
    2/3 entries 49/55
    dependencies 27/32 modules 5 active
*/

type høøks = keyof webpack.Compiler['hooks'];

type FnParams = unknown[];
type Fn = (...args: FnParams) => any;
type LogType = 'error' | 'warn' | 'info';
type LogLevel = LogType | 'silent';
const LogLevels: Record<LogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
};

interface Logger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
  clearScreen(type: LogType): void;
}

export interface State {
  start?: [number, number] | null;
  done?: boolean;
  message?: string;
  hasErrors?: boolean;
}

const globalState: State = {
  hasErrors: false,
  done: false,
  start: null,
  message: '',
};

interface IpURL extends URL {
  isIpv6?: boolean;
}

interface Urls {
  local?: IpURL | string;
  network?: IpURL[] | string[];
  haveIpv6?: boolean;
  ready: boolean;
}

const withTapCompiler = (compiler: webpack.Compiler, name: string) => (type: høøks, fn: Fn) => {
  return compiler.hooks[type].tap(name, fn);
};

/**
 * Mamba Logger class
 */
export default class InfrastructureMamaLogger extends webpack.ProgressPlugin implements Logger {
  static logName = c`{green.bold MAMBA} {green.dim SDK}`;

  name: string = InfrastructureMamaLogger.name;

  lastType?: LogType;

  lastMessage?: string;

  lastProgressMessage = '';

  sameCount = 0;

  printed = false;

  logUpdate = new LogUpdate();

  buildStatus = '';

  private urls: Urls = {
    local: pico.cyan('... waiting for server'),
    network: undefined,
    ready: false,
  };

  set progressOutput(value: string) {
    this.logUpdate.render(value);
  }

  get canClearScreen() {
    return process.stdout.isTTY && !process.env.CI;
  }

  get state(): State {
    return globalState;
  }

  setState(obj: State) {
    Object.assign(this.state, obj);
  }

  // eslint-disable-next-line no-useless-constructor
  constructor(public level: LogLevel = 'info') {
    super({ activeModules: true });

    super.handler = (percent, message, ...details) => {
      this.progressOutput = this.handleProgress(percent, message, details);
    };
  }

  async apply(compiler: webpack.Compiler) {
    super.apply(compiler);
    const hook = withTapCompiler(compiler, this.name);

    hook('infrastructureLog', (source: unknown, type: unknown, ...logs: unknown[]) => {
      let item = '';
      if (logs.length > 0) {
        if (Array.isArray(logs[0])) {
          // eslint-disable-next-line prefer-destructuring
          item = logs[0][0];
        } else if (typeof logs[0] === 'string') {
          item = String(logs[0]);
        }
      }

      if (source === 'webpack-dev-server') {
        const found = this.detectUrls(item);

        switch (found?.version) {
          case 'local':
            this.urls.local = found.value;
            break;

          case 'network-v4':
          case 'network-v6':
            if (!Array.isArray(this.urls.network)) {
              this.urls.network = [];
            }

            (this.urls.network as IpURL[]).push(found.value);

            if (found?.version === 'network-v6') this.urls.haveIpv6 = true;
            break;
          default:
            break;
        }

        this.urls.ready = true;
        return;
      }

      if (type === 'log') type = 'info';
      let msg =
        logs.length === 0 || item.length === 0 || typeof item === 'string'
          ? c`{green ${item}}`
          : item;

      if (source === 'webpack-cli') {
        if (msg.match(/Compiler|Changed time|Compilation/gim)) {
          return;
        }

        if (msg.match(/.env.js/g)) {
          return;
        }

        if (msg.match(/File '.*'/g)) {
          msg = msg.replace(/(File) ('.*') (.+)/g, c`{cyan $1} {magenta.bold $2} {cyan $3}`);
        }

        if (msg.match(/webpack/g)) {
          msg = msg.replace(/webpack/g, '');
        }
      }

      if (type === LogLevels.error) {
        this.clearScreen();
      }
      this.output(type as LogType, msg);
    });

    hook('environment', () => {
      this.printServerUrls(this.urls, false);
    });

    hook('compile', () => {
      this.setState({ start: process.hrtime() });
    });

    hook('done', (stats) => {
      if (this.state.done) {
        return;
      }

      const hasErrors = (stats as webpack.Stats).hasErrors();
      const status = hasErrors ? 'with some errors' : 'successfully';

      const time = this.state.start
        ? c` in {white ${prettyTime(process.hrtime(this.state.start), 2)}}`
        : '';

      this.setState({
        done: true,
        message: c` {dim compiled ${status}}${time}`,
        hasErrors,
      });

      this.handleProgress(100, 'Finishing');

      if (this.urls.ready && !this.printed) {
        this.printServerUrls(this.urls, this.urls.ready);
        this.logUpdate.done();
      }

      if (hasErrors) {
        this.logUpdate.done();
      }
    });
  }

  private output(type: LogType, msg: string) {
    if (LogLevels[this.level] < LogLevels[type]) {
      return;
    }

    const method = LogLevels.info === LogLevels[type] ? 'log' : type;

    if (this.canClearScreen) {
      if (type === this.lastType && msg === this.lastMessage) {
        this.sameCount++;
        console[method](msg, pico.yellow(`(x${this.sameCount + 1})`));
      } else {
        this.sameCount = 0;
        this.lastMessage = msg;
        this.lastType = type;
        console[method](msg);
      }
    } else {
      console[method](msg);
    }
  }

  private detectUrls(
    str: string,
  ): { version: 'network-v4' | 'network-v6' | 'local'; value: IpURL } | undefined {
    const preurls = str.match(/(https?:\/\/.*\/)/gi);
    const normalLower = str.toLowerCase();
    if (preurls?.length && typeof preurls[0] === 'string') {
      const value: IpURL = new URL(preurls[0]);
      const version = normalLower.includes('loopback')
        ? 'local'
        : normalLower.includes('ipv6')
        ? 'network-v6'
        : 'network-v4';

      value.isIpv6 = version === 'network-v6';

      return {
        value,
        version,
      };
    }

    return undefined;
  }

  info(msg: string) {
    this.output('info', msg);
  }

  warn(msg: string) {
    this.output('warn', msg);
  }

  error(msg: string) {
    this.output('error', msg);
  }

  clearScreen() {
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
  }

  private ellipsisLeft(str: string, n: number) {
    if (str.length <= n - 3) {
      return str;
    }
    return `...${str.substr(str.length - n - 1)}`;
  }

  private firstMatch(regex: RegExp, str: string) {
    const m = regex.exec(str);
    return m ? m[0] : null;
  }

  private hasValue(s: any[] | string | null | undefined) {
    return s && s.length;
  }

  private first(arr: any[]) {
    return arr[0];
  }

  private last(arr: any[]) {
    return arr.length ? arr[arr.length - 1] : null;
  }

  private removeAfter(delimiter: string, str: string) {
    return this.first(str.split(delimiter)) || '';
  }

  private removeBefore(delimiter: string, str: string) {
    return this.last(str.split(delimiter)) || '';
  }

  private parseRequest(requestStr: string | undefined) {
    const parts = (requestStr || '').split('!');

    const file = path.relative(
      process.cwd(),
      this.removeAfter('?', this.removeBefore(NODE_MODULES, parts.pop() as string)),
    );

    const loaders = parts
      .map((part: string) => this.firstMatch(/[a-z0-9-@]+-loader/, part))
      .filter(this.hasValue);

    return {
      file: this.hasValue(file) ? file : null,
      loaders,
    };
  }

  private formatRequest = (request: { file: string | null; loaders: any[] }) => {
    const loaders = request.loaders.join(NEXT);

    if (!loaders.length) {
      const file = request.file || '';
      return file;
    }

    return `${loaders}${NEXT}${request.file}`;
  };

  private fillGap(str1: string, str2: string, offset = 0) {
    const repeatCount = Math.max(
      0,
      MAX_LINE_LENGTH -
        (str1.replace(onlyTextRegx, '').length + str2.replace(onlyTextRegx, '').length) -
        -offset,
    );

    const gap = ' '.repeat(repeatCount);
    return `${str1}${gap}${str2}`;
  }

  private printServerUrls(urls: Urls, serverReady = false): string {
    if (this.printed) return '';

    function customUrlString(hostname: string, port: string | number) {
      return `http://${hostname}:${port}`;
    }

    function networkAddressLine(url: string, type = '', color = 'gray'): string {
      return c`{green ➜} ${type}{${color} ${url}}`;
    }

    let localUrlPart = urls.local;

    // format local
    if (urls.local instanceof URL) {
      const normalUrl = new URL(urls.local || customUrlString(HOST, PORT));
      normalUrl.port = c`{red ${normalUrl.port}}`;
      localUrlPart = networkAddressLine(
        normalUrl.href.replace(normalUrl.port, c`{bold ${normalUrl.port}}`),
        '',
        'cyan',
      );
    }

    const localLine = this.fillGap(c`{blue.bold ◼︎ Local}`, String(localUrlPart));

    // format networks
    const networks: string[] = [];

    if (Array.isArray(urls.network) && urls.network.length > 0 && urls.network[0] instanceof URL) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const types = (url: IpURL) => `${url.isIpv6 && urls.network!.length > 1 ? 'IPv6' : 'IPv4'}:`;

      urls.network.forEach((url: IpURL | string, index: number) => {
        const type = url instanceof URL ? types(url) : url;
        let line = url instanceof URL ? networkAddressLine(url.href, type) : url;

        const microGap = ' '.repeat(
          Math.max(1, MAX_URL_LENGTH - (line.replace(onlyTextRegx, '').length - type.length) + 1),
        );
        const startPos = line.lastIndexOf(type) + type.length;
        line = `${line.slice(0, startPos)}${microGap}${line.slice(startPos)}`;

        if (index === 0) {
          networks[0] = `\n${c`${this.fillGap(c`{blue ◼︎ Network}`, line)}`}`;
          return;
        }

        networks.push(`\n${this.fillGap('', line, -1)}`);
      });
    }

    const banner = c`${InfrastructureMamaLogger.logName} ${this.state.message}\n\n{gray Project is running at:}`;

    const lines = (
      [
        `\n${banner}`,
        `\n\n${localLine}`,
        `\n${LINE}`,
        ...(serverReady ? networks : []),
        serverReady && '\n',
      ].filter(Boolean) as string[]
    ).join('');

    this.clearScreen();
    this.output('info', lines);

    return lines;
  }

  private handleProgress(percent = 0, message = '', details: string[] = []) {
    // not using color template here for better performance

    const colorName = 'white';
    const color = pico[colorName];

    const progress = Math.floor(percent * 100);
    const activeModule = details.pop();
    const request = this.parseRequest(activeModule);

    if (message.length === 0) {
      message = this.lastProgressMessage;
    } else {
      this.lastProgressMessage = message;
    }

    let icon = LPAD;
    let line1 = '';
    let line2 = '';

    if (progress >= 0 && progress < 100) {
      const progressText = dim(blue(`(${progress || 0}%) `));

      const leftCol = `${blue(CIRCLE_OPEN)} ${blue(bold(message))}`;

      line1 = this.fillGap(leftCol, `${progressText}${this.renderBar(progress, colorName)}`);

      line2 = [
        LPAD,
        pico.gray(details[0] || ''),
        pico.gray(details[1] || ''),
        request
          ? `\n${LPAD}${pico.gray(
              this.ellipsisLeft(this.formatRequest(request), this.logUpdate.columns),
            )}`
          : '',
      ].join('');
    } else {
      let status = '';
      if (this.state.hasErrors) {
        icon = pico.red(CROSS);
        status = 'Failed';
      } else if (percent === 100) {
        icon = TICK;
        status = 'No errors';
      } else if (percent === -1) {
        icon = CIRCLE_OPEN;
        status = '';
      }

      line1 = '';
      line2 = '';
      this.buildStatus = `\n\n${icon} ${color(status)}`;
    }

    return `${line1}\n${line2}`;
  }

  private range(len: number) {
    const arr: number[] = [];
    for (let i = 0; i < len; i++) {
      arr.push(i);
    }
    return arr;
  }

  private renderBar(progress: number, color: string) {
    const w = progress * (BAR_LENGTH / 100);
    const fg = pico[color](BLOCK_FG);

    return [
      dim(pico[color](CORNER_LEFT)),
      ...this.range(BAR_LENGTH).map((i: number) => (i < w ? fg : BLOCK_BG)),
      dim(pico[color](CORNER_RIGHT)),
    ].join('');
  }
}
