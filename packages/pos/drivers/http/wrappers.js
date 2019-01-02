export default function(driver) {
  driver.send = function send(configParams) {
    return new Promise((resolve, reject) => {
      if (typeof configParams.data !== 'string') {
        configParams.data = JSON.stringify(configParams.data);
      }

      driver.race([
        ['requestFailed', () => reject(driver.getError())],
        ['requestFinished', () => resolve(driver.getData())],
      ]);

      /** Asynchronously make a request at the backend */
      driver.doSend(configParams);
    });
  };
}
