import extendDriver from '../drivers/extend.js';
import paymentWrappers from '../drivers/payment/wrappers.js';
import cancellationWrappers from '../drivers/cancellation/wrappers.js';

/** Merge, while renaming, the exposed cancellation driver with the payment driver */
const {
  $Cancellation: {
    doCancellation,
    getAmmount: getCancelledAmount,
    failedCancellation,
    cancellationDone,
  },
} = window;

export default extendDriver(
  window.Payment,
  paymentWrappers,
  {
    doCancellation,
    getCancelledAmount,
    failedCancellation,
    cancellationDone,
  },
  cancellationWrappers,
);
