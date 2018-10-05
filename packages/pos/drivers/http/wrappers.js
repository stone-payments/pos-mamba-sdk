export default function(driver) {
  driver.send = function send(configParams) {
    return new Promise((resolve, reject) => {
      driver.once('requestFailed', () => {
        return reject(driver.getError());
      });
      driver.once('requestFinished', () => {
        resolve(driver.getData());
      });

      /** Asynchronously make a request at the backend */
      driver.doSend(configParams);
    });
  };
}
