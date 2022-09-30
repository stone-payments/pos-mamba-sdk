const EVENT_TYPE = {
  PRINT: 'printer',
  POOLING: 'pooling',
  APP: 'app',
  JS: 'js',
};

const DITHERING_COMMANDS = {
  ENABLE_DITHERING: 'enable-dithering',
  DISABLE_DITHERING: 'disable-dithering',
};

const PRINT_COMMANDS = {
  PRINT_LAST: 'print-last',
};

const POOLING_COMMANDS = {
  START: 'start',
  STOP: 'stop',
};

const APP_COMMANDS = {
  CLOSE: 'close',
};

const JS_COMMANDS = {
  eval: 'eval',
};

/* function getValuesOf(...commands) {
  return commands.flatMap((command) => Object.values(command));
}
 */
const COMMANDS = {
  [EVENT_TYPE.PRINT]: [
    DITHERING_COMMANDS.ENABLE_DITHERING,
    DITHERING_COMMANDS.DISABLE_DITHERING,
    PRINT_COMMANDS.PRINT_LAST,
  ],
  [EVENT_TYPE.POOLING]: [POOLING_COMMANDS.START, POOLING_COMMANDS.STOP],
  [EVENT_TYPE.APP]: [APP_COMMANDS.CLOSE],
  [EVENT_TYPE.JS]: [JS_COMMANDS.CLOSE],
};

module.exports = {
  EVENT_TYPE,
  COMMANDS,
  DITHERING_COMMANDS,
  PRINT_COMMANDS,
  POOLING_COMMANDS,
  APP_COMMANDS,
  JS_COMMANDS,
};
