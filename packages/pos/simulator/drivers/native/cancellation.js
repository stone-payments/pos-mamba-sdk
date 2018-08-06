import Signal from '../../signal.js';
import Simulator from '../../api.js';

const DEFAULT_SETTINGS = {
  cancelledAmount: -1,
  shouldCancellationFail: false,
};

const SIGNALS = ['cancellationDone'];

export default function setup(Cancellation) {
  Simulator.set('cancellation', DEFAULT_SETTINGS);
  Signal.register(Cancellation, SIGNALS);

  /**
   * Return if the cancellation failed
   * @memberof Payment
   * @return {boolean} True if cacellation failed.
   */
  Cancellation.failedCancellation = () =>
    Simulator.get('cancellation.shouldCancellationFail');

  /**
   * Return the cancelled amount
   * @memberof Payment
   * @return {number} the last cancelled amount transaction
   */
  Cancellation.getAmmount = () =>
    Cancellation.failedCancellation()
      ? 0
      : Simulator.get('cancellation.cancelledAmount');

  Cancellation.doCancellation = () => {
    Simulator.set(
      'cancellation.cancelledAmount',
      Simulator.get('payment.authorizedAmount'),
    );
    Cancellation.cancellationDone();
  };
}
