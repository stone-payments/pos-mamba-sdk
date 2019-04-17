export default function(driver) {
  driver.send = function send(opts) {
    return new Promise((resolve, reject) => {
      /** Accept body and data as the body parameter */
      if (
        typeof opts.data === 'undefined' &&
        typeof opts.body !== 'undefined'
      ) {
        opts.data = opts.body;
      }

      /** Default content type to json */
      if (!opts.headers) {
        opts.headers = { 'Content-Type': 'application/json;charset=UTF-8' };
      }

      if (typeof opts.data !== 'string') {
        opts.data = JSON.stringify(opts.data);
      }

      driver.race([
        ['requestFailed', () => reject(driver.getError())],
        ['requestFinished', () => resolve(driver.getData())],
      ]);

      /** Asynchronously make a request at the backend */
      driver.doSend(opts);
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
