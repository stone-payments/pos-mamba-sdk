let isCardEventEnabled = false;
const triggerCardEvent = () => {
  if (isCardEventEnabled) {
    const event = document.createEvent('CustomEvent');
    event.initCustomEvent('cardEvent', true, true);
    document.dispatchEvent(event);
  }
};

export default function(driver) {
  driver.pay = params =>
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
        return reject(
          new Error('BAD USAGE: Proposed amount must be greater than 0!'),
        );
      }

      driver.once('paymentDone', () => resolve(driver.getAmountAuthorized()));
      driver.doPay(params);
    });

  driver.enableCardEvent = () => {
    console.warn(
      '[@mamba/pos/api/payment] The "enableCardEvent()" method is deprecated. Please use "Card.on(\'cardInserted\', function(){...})"',
    );
    isCardEventEnabled = true;
    driver.unique('cardEvent', triggerCardEvent);
    driver.doEnableCardEvent();
  };

  driver.disableCardEvent = () => {
    console.warn(
      '[@mamba/pos/api/payment] The "disableCardEvent()" method is deprecated. Please use "Card.off(\'cardInserted\')"',
    );
    isCardEventEnabled = false;
    driver.off('cardEvent', triggerCardEvent);
    driver.doDisableCardEvent();
  };
}
