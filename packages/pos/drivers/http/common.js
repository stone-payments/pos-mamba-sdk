export default function(Http) {
  Http.send = function send(configParams) {
    return new Promise((resolve, reject) => {
      Http.once('requestFinished', () => {
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
