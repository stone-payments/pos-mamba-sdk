export default function (driver) {
  driver.cancel = (atk = '') =>
    new Promise((resolve, reject) => {
      driver.once('cancellationDone', () => {
        if (driver.failedCancellation()) {
          reject(new Error('Cancellation Failed.'));
        } else {
          resolve(driver.getCancelledAmount());
        }
      });
      driver.doCancellation(atk);
    });
}
