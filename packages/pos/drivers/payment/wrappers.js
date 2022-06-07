export default function (driver) {
  driver.pay = (params) =>
    new Promise((resolve, reject) => {
      if (typeof params !== 'object') {
        params = {
          amount: params,
          editable_amount: true,
        };
      }

      if (driver.isPaying()) {
        return reject(new Error('Payment is already in progress'));
      }

      if (params.amount <= 0) {
        return reject(new Error('BAD USAGE: Proposed amount must be greater than 0!'));
      }

      driver.once('paymentDone', (e) => {
        if (driver.failedPaying()) {
          reject(e);
        } else {
          resolve(driver.getAmountAuthorized());
        }
      });

      driver.doPay(params);
    });
}
