/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Based on https://github.com/sindresorhus/log-update/blob/master/index.js
// and https://github.com/unjs/webpackbar

const originalWrite = Symbol('webpackbarWrite');

const ESC = '\u001B[';
const eraseLine = `${ESC}2K`;
const cursorLeft = `${ESC}G`;

export default class LogUpdate {
  private prevLineCount: number;

  private listening: any;

  private extraLines: any;

  private _streams: any;

  constructor() {
    this.prevLineCount = 0;
    this.listening = false;
    this.extraLines = '';
    this._onData = this._onData.bind(this);
    this._streams = [process.stdout, process.stderr];
  }

  render(lines: string) {
    this.listen();
    const data = `${this.eraseLines(this.prevLineCount)}${lines}\n${this.extraLines}`;

    this.write(data);

    const _lines = data.split('\n');
    this.prevLineCount = _lines.length;
  }

  get columns() {
    return (process.stderr.columns || 80) - 2;
  }

  write(data: any) {
    const stream = process.stderr;
    if (stream.write[originalWrite]) {
      stream.write[originalWrite].call(stream, data, 'utf-8');
    } else {
      stream.write(data, 'utf-8');
    }
  }

  cursorUp(count = 1) {
    return `${ESC + count}A`;
  }

  eraseLines(count: number) {
    let clear = '';

    for (let i = 0; i < count; i++) {
      clear += eraseLine + (i < count - 1 ? this.cursorUp() : '');
    }

    if (count) {
      clear += cursorLeft;
    }

    return clear;
  }

  clear() {
    this.done();
    this.write(this.eraseLines(this.prevLineCount));
  }

  done() {
    this.stopListen();

    this.prevLineCount = 0;
    this.extraLines = '';
  }

  _onData(data: any) {
    const str = String(data);
    const lines = str.split('\n').length - 1;
    if (lines > 0) {
      this.prevLineCount += lines;
      this.extraLines += data;
    }
  }

  listen() {
    // Prevent listening more than once
    if (this.listening) {
      return;
    }

    // Spy on all streams
    for (const stream of this._streams) {
      // Prevent overriding more than once
      if (stream.write[originalWrite]) {
        continue;
      }

      // Create a wrapper fn
      const write = (data: any, ...args: any[]) => {
        if (!stream.write[originalWrite]) {
          return stream.write(data, ...args);
        }
        this._onData(data);
        return stream.write[originalWrite].call(stream, data, ...args);
      };

      // Backup original write fn
      write[originalWrite] = stream.write;

      // Override write fn
      stream.write = write;
    }

    this.listening = true;
  }

  stopListen() {
    // Restore original write fns
    for (const stream of this._streams) {
      if (stream.write[originalWrite]) {
        stream.write = stream.write[originalWrite];
      }
    }

    this.listening = false;
  }
}
