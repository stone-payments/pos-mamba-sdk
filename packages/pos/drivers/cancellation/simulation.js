import { Registry } from '../../simulator/index.js';

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
    Registry.get().$Cancellation.shouldCancellationFail;

  /**
   * Return the cancelled amount
   * @memberof Payment
   * @return {number} the last cancelled amount transaction
   */
  Cancellation.getAmount = () =>
    Cancellation.failedCancellation()
      ? 0
      : Registry.get().$Cancellation.cancelledAmount;

  Cancellation.doCancellation = () => {
    Registry.set(
      '$Cancellation.cancelledAmount',
      Registry.get().$Payment.authorizedAmount,
    );
    Cancellation.cancellationDone();
  };
}
