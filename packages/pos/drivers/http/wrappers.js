export default function(driver) {
  driver.send = function send(configParams) {
    return new Promise((resolve, reject) => {
      const refSignal = `${Math.random() * new Date().getMilliseconds()}`;

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
}
