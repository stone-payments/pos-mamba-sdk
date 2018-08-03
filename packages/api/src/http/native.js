import SignalHandler from '@mambasdk/signal/src/handler.js';

export default function(Http) {
  const HttpSignals = SignalHandler(Http);

  Http.send = function send(configParams) {
    return new Promise((resolve, reject) => {
      HttpSignals.once('requestFinished', () => {
        if (Http.getError()) {
          return reject(Http.getError());
        }
        resolve(Http.getData());
      });

      /** Asynchronously make a request at the backend */
      Http.doSend(configParams);
    });
  };
}
