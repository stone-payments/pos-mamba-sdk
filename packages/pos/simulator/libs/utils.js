/**
 * This file contain utility methods used by the simulator.
 */

export const LOG_PREFIX = '[Mamba Simulator]';

export function log(...args) {
  console.log([LOG_PREFIX, ...args].join(' '));
}

export function error(...args) {
  console.error([LOG_PREFIX, ...args].join(' '));
}

export function warn(...args) {
  console.warn([LOG_PREFIX, ...args].join(' '));
}

export const deepCopy = (o) => JSON.parse(JSON.stringify(o));
