export default function (driver) {
  driver.send = function send(opts) {
    return new Promise((resolve, reject) => {
      const refSignal = `${Math.random() * new Date().getMilliseconds()}`;
      let refReply = '';

      /** Accept body and data as the body parameter */
      if (typeof opts.data === 'undefined' && typeof opts.body !== 'undefined') {
        opts.data = opts.body;
      }

      /** Default content type to json */
      if (!opts.headers) {
        opts.headers = { 'Content-Type': 'application/json;charset=UTF-8' };
      }

      if (typeof opts.data !== 'string') {
        opts.data = JSON.stringify(opts.data);
      }

      driver.on('requestRefSinal', (data, id) => {
        if (refSignal !== id) return false;

        refReply = data;
      });

      driver.race([
        [
          'requestFailed',
          (err, id) => {
            if (refReply !== id) return false;
            reject(err);
          },
        ],
        [
          'requestFinished',
          (data, id) => {
            if (refReply !== id) return false;
            resolve(data);
          },
        ],
      ]);
      const hasDoSendRequest = typeof window.$Http.doSendRequest === 'function';
      /** Asynchronously make a request at the backend */
      if (hasDoSendRequest && typeof opts === 'object' && opts.encodeURI === false) {
        driver.doSendRequest(opts, refSignal);
      } else {
        driver.doSend(opts, refSignal);
      }
    });
  };

  driver.post = (opts) => {
    opts.method = 'POST';
    return driver.send(opts);
  };

  driver.get = (opts) => {
    opts.method = 'GET';
    return driver.send(opts);
  };
}
