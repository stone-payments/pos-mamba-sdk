import SignalHandler from '../signal/handler.js';

let isCardEventEnabled = false;
const triggerCardEvent = () => {
  if (isCardEventEnabled) {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('cardEvent', true, true);
    document.dispatchEvent(event);
  }
};

export default function (Payment) {
  const PaymentSignals = SignalHandler(Payment);

  Payment.pay = (params, onPayCallback) => {
    if (typeof params !== 'object') {
      params = {
        amount: params,
        editable_amount: true,
      };
    }

    if (Payment.isPaying()) {
      console.warn('[@mamba/native/payment] Payment is already in progress');
      return onPayCallback(0); // TODO: arguments.callee
    }

    if (params.amount <= 0) {
      console.error('[@mamba/native/payment] BAD USAGE: Proposed amount must be greater than 0!');
      return;
    }

    PaymentSignals.once('paymentDone', () => {
      if (typeof onPayCallback === 'function') {
        const amountPaid = Payment.getAmountAuthorized();
        onPayCallback(amountPaid);
      }
    });
    Payment.doPay(params);
  };

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
