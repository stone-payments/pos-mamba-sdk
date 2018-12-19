import Signal from '../../libs/signal.js';
import extendDriver from '../../../drivers/extend.js';

const HardwareManager = extendDriver({});

Signal.register(HardwareManager, [
  'startPrinting',
  'endPrinting',
  'toggleCard',
  'changeBrightness',
]);

export default HardwareManager;
