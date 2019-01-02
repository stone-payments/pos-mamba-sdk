export default () => {
  const eventHandlers = {};

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

  const once = (event, handler) => {
    const listener = on(event, (...data) => {
      handler(...data);
      listener.cancel();
    });
    return listener;
  };

  const fire = (event, ...data) => {
    const handlers = eventHandlers[event];
    if (handlers && handlers.length) {
      handlers.forEach(handler => handler(...data));
    }
  };

  return { on, once, fire, off, events: eventHandlers };
};
