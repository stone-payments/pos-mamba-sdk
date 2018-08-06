export default function(driver) {
  driver.send = function send(configParams) {
    return new Promise((resolve, reject) => {
      driver.once('requestFinished', () => {
        if (driver.getError()) {
          return reject(driver.getError());
        }
        resolve(driver.getData());
      });

      /** Asynchronously make a request at the backend */
      driver.doSend(configParams);
    });
  };
}
