export default () => {
  const eventHandlers = {};

  const fire = (event, ...data) => {
    const handlers = eventHandlers[event];
    if (handlers && handlers.length) {
      handlers.forEach((handler) => handler(...data));
    }
  };

  const off = (event, handler) => {
    const handlers = eventHandlers[event];

    if (handlers && handlers.length && handler) {
      const handlerIndex = handlers.indexOf(handler);
      if (handlerIndex > -1) {
        handlers.splice(handlerIndex, 1);
      }

      if (!handlers.length) {
        delete eventHandlers[event];
      }
    }
  };

  const on = (event, handler) => {
    if (!eventHandlers[event]) {
      eventHandlers[event] = [];
    }

    if (eventHandlers[event].indexOf(handler) === -1) {
      eventHandlers[event].push(handler);
    }

    return { cancel: () => off(event, handler) };
  };

  /** The first signal dispatched is executed and automatically cancel all others */
  const race = (entries) => {
    const wrappedCallbacks = {};
    entries.forEach(([event, callback]) => {
      /** Wrap the signal callback to disconnect all slots once one of the signals are emitted */
      wrappedCallbacks[event] = (...data) => {
        callback(...data);
        Object.keys(wrappedCallbacks).forEach((signalName) => {
          off(signalName, wrappedCallbacks[signalName]);
        });
      };

      /** Listen to the signal emission */
      on(event, wrappedCallbacks[event]);
    });
  };

  /** Execute once a callback when the signal is dispatched and disconnect from it */
  const once = (event, handler) => {
    const listener = on(event, (...data) => {
      handler(...data);
      listener.cancel();
    });
    return listener;
  };

  return {
    on,
    once,
    race,
    off,
    fire,
    events: eventHandlers,
  };
};
