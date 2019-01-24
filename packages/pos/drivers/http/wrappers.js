export default function(driver) {
  driver.send = function send(opts) {
    return new Promise((resolve, reject) => {
      const refSignal = `${Math.random() * new Date().getMilliseconds()}`;

      if (typeof configParams.data !== 'string') {
        configParams.data = JSON.stringify(configParams.data);
      }

      driver.race([
        [
          'requestFailed',
          (err, id) => {
            if (refSignal !== id) return false;
            reject(err);
          },
        ],
        [
          'requestFinished',
          (data, id) => {
            if (refSignal !== id) return false;
            resolve(data);
          },
        ],
      ]);

      /** Asynchronously make a request at the backend */
      driver.doSend(configParams, refSignal);
    });
  };

  driver.post = opts => {
    opts.method = 'POST';
    return driver.send(opts);
  };

  driver.get = opts => {
    opts.method = 'GET';
    return driver.send(opts);
  };
}
