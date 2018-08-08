import { Simulator } from '../../simulator/libs/main.js';

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
    Simulator.get('Cancellation.shouldCancellationFail');

  /**
   * Return the cancelled amount
   * @memberof Payment
   * @return {number} the last cancelled amount transaction
   */
  Cancellation.getAmmount = () =>
    Cancellation.failedCancellation()
      ? 0
      : Simulator.get('Cancellation.cancelledAmount');

  Cancellation.doCancellation = () => {
    Simulator.set(
      'cancellation.cancelledAmount',
      Simulator.get('payment.authorizedAmount'),
    );
    Cancellation.cancellationDone();
  };
}
