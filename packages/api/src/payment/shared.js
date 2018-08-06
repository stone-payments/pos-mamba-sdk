import SignalHandler from '@mambasdk/signal/handler.js';

let isCardEventEnabled = false;
const triggerCardEvent = () => {
  if (isCardEventEnabled) {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('cardEvent', true, true);
    document.dispatchEvent(event);
  }
};

export default function(Payment) {
  const PaymentSignals = SignalHandler(Payment);

  Payment.pay = params =>
    new Promise((resolve, reject) => {
      if (typeof params !== 'object') {
        params = {
          amount: params,
          editable_amount: true,
        };
      }

      if (Payment.isPaying()) {
        return reject(new Error('Payment is already in progress'));
      }

      if (params.amount <= 0) {
        return reject(
          new Error('BAD USAGE: Proposed amount must be greater than 0!'),
        );
      }

      PaymentSignals.once('paymentDone', () =>
        resolve(Payment.getAuthorizedAmount()),
      );
      Payment.doPay(params);
    });

  Payment.cancel = atk =>
    new Promise((resolve, reject) => {
      if (typeof atk !== 'string') {
        return reject(new Error('BAD USAGE: ATK must be a String.'));
      }

      PaymentSignals.once('cancellationDone', () => {
        if (Payment.failedCancellation()) {
          reject(new Error('Cancellation Failed.'));
        } else {
          resolve(Payment.getCancelledAmount());
        }
      });
      Payment.doCancellation(atk);
    });

  Payment.enableCardEvent = () => {
    isCardEventEnabled = true;
    PaymentSignals.unique('cardEvent', triggerCardEvent);
    Payment.doEnableCardEvent();
  };

  Payment.disableCardEvent = () => {
    isCardEventEnabled = false;
    PaymentSignals.off('cardEvent', triggerCardEvent);
    Payment.doDisableCardEvent();
  };
}
