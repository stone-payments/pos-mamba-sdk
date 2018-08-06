let isCardEventEnabled = false;
const triggerCardEvent = () => {
  if (isCardEventEnabled) {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('cardEvent', true, true);
    document.dispatchEvent(event);
  }
};

export default function(Payment) {
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

      Payment.once('paymentDone', () => resolve(Payment.getAmountAuthorized()));
      Payment.doPay(params);
    });

  Payment.enableCardEvent = () => {
    isCardEventEnabled = true;
    Payment.unique('cardEvent', triggerCardEvent);
    Payment.doEnableCardEvent();
  };

  Payment.disableCardEvent = () => {
    isCardEventEnabled = false;
    Payment.off('cardEvent', triggerCardEvent);
    Payment.doDisableCardEvent();
  };
}
