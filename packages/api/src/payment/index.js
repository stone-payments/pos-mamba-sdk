import mock from './mock.js';
import addSharedTo from './shared.js';

const Payment = window.Payment || {};
const Cancellation = window.$Cancellation || {};

/** Merges Cancellation with Payment */
Object.assign(Payment, {
  cancel: Cancellation.cancel,
  doCancellation: Cancellation.doCancellation,
  getCancelledAmount: Cancellation.getAmmount,
  failedCancellation: Cancellation.failedCancellation,
  cancellationDone: Cancellation.cancellationDone,
});

/** For development environment */
if (process.env.NODE_ENV !== 'production') {
  addSharedTo(Payment);
  mock(Payment);
}

/** For production environment */
if (process.env.NODE_ENV === 'production') {
  addSharedTo(Payment);
}

/** Nullify the original exposed reference */
window.Payment = null;

export default Payment;
