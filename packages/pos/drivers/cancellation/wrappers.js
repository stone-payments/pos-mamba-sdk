export default function setup(driver) {
  driver.cancel = atk =>
    new Promise((resolve, reject) => {
      if (typeof atk !== 'string') {
        return reject(new Error('BAD USAGE: ATK must be a String.'));
      }
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
