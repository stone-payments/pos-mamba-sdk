export const LOG_PREFIX = '[Mamba Simulator]';

export function log(...args) {
  console.log(LOG_PREFIX, ...args);
}

export function error(...args) {
  console.error(LOG_PREFIX, ...args);
}

export function warn(...args) {
  console.warn(LOG_PREFIX, ...args);
}
