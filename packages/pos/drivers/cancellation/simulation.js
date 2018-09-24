import { Core } from '../../simulator/index.js';

export const NAMESPACE = '$Cancellation';

export const SETTINGS = {
  cancelledAmount: -1,
  shouldCancellationFail: false,
};

export const SIGNALS = ['cancellationDone'];

export function setup(Cancellation) {
  /**
   * Return if the cancellation failed
   * @memberof Payment
   * @return {boolean} True if cacellation failed.
   */
  Cancellation.failedCancellation = () =>
    Core.get('$Cancellation.shouldCancellationFail');

  /**
   * Return the cancelled amount
   * @memberof Payment
   * @return {number} the last cancelled amount transaction
   */
  Cancellation.getAmount = () =>
    Cancellation.failedCancellation()
      ? 0
      : Core.get('$Cancellation.cancelledAmount');

  Cancellation.doCancellation = () => {
    Core.set(
      '$Cancellation.cancelledAmount',
      Core.get('$Payment.authorizedAmount'),
    );
    Cancellation.cancellationDone();
  };
}
