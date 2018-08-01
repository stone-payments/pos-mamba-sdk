import SignalEmitter from './emitter.js';
import Signal from './index.js';

const noop = () => {};

export default function flowFactory(namespace) {
  const flow = {
    addSignal: (signalName) => {
      namespace[signalName] = Signal();
    },
    addEmitter: (mockMethodName, realMethod, signalToFire, delay) => {
      namespace[mockMethodName] = SignalEmitter(
        namespace,
        realMethod || noop,
        delay,
      ).add(signalToFire);
      return flow;
    },
  };
  return flow;
}
