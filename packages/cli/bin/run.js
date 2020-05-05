#!/usr/bin/env node

const match = process.version.match(/v(\d+)\.(\d+)/);
const major = parseInt(match[1], 10);
const minor = parseInt(match[2], 10);

// If older than 10.13
if (major < 10 || (major === 10 && minor < 13)) {
  console.error(
    `\x1B[31mERROR: Node.js ${
      process.version
    } is no longer supported.\x1B[39m\n` +
      `\x1B[31m\x1B[39m\n` +
      `\x1B[31mexpo-cli supports following Node.js versions:\x1B[39m\n` +
      `\x1B[31m* >=10.13.0 <11.0.0 (Active LTS)\x1B[39m\n` +
      `\x1B[31m* >=12.0.0 <13.0.0 (Active LTS)\x1B[39m\n` +
      `\x1B[31m* >=13.0.0 <14.0.0 (Current Release)\x1B[39m`,
  );
  process.exit(1);
}

require('../build/cli.js').run('mamba');
