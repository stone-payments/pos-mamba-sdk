const { readFileSync, existsSync } = require('fs');
const { resolve } = require('path');
const { fromCwd } = require('quickenv');

const VIRTUAL_FILES = ['./index.js','./simulator.js'];

module.exports = () => VIRTUAL_FILES.reduce((acc, filepath) => {
  /** If real file doesn't exist, load the virtual one */
  if(!existsSync(fromCwd('src', filepath))) {
    acc[filepath] = readFileSync(resolve(__dirname, '..', 'virtual-files', filepath));
  }
  return acc;
}, {});
