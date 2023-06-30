export default function (driver) {
  driver.print = (content, options = {}) =>
    new Promise((resolve, reject) => {
      driver.once('printerDone', () => {
        if (driver.failedPrinting()) {
          reject(new Error('NO_PAPER'));
        } else {
          resolve();
        }
      });

      driver.doPrint(content, options);
    });
}
