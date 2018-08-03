import Signal from '@mambasdk/signal/signal.js';

export default function(Payment) {
  const CONFIG = {
    amountPaid: -1,
    installmentCount: 0,
    shouldFail: false,
    cardHolderName: 'SPORTELLO/DOC',
    pan: '56497#####41578',
    type: 'CREDITO/DEBITO',
    authCode: '111111111',
    cardBrand: 'bandeiraTeste',
    atk: '11111111111111',
    itk: '11111111111111',
    orderId: '111111111',
    authorizedAmount: 0,
  };
  Payment.browserConfig = CONFIG;

  let _isPaying = false;

  function isPaying() {
    return _isPaying;
  }

  function failedPaying() {
    return CONFIG.shouldFail;
  }

  function getCardHolderName() {
    return !failedPaying() ? '' : CONFIG.cardHolderName;
  }

  function getAtk() {
    return !failedPaying() ? '' : CONFIG.atk;
  }

  function getItk() {
    return !failedPaying() ? '' : CONFIG.itk;
  }

  function getAuthorizedAmount() {
    return failedPaying() ? 0 : CONFIG.authorizedAmount;
  }

  function getAuthorizationDateTime() {
    return !failedPaying() ? '' : new Date();
  }

  function getBrand() {
    return !failedPaying() ? '' : CONFIG.cardBrand;
  }

  function getOrderId() {
    const orderId = '';
    return !failedPaying() ? orderId : CONFIG.orderId;
  }

  function getAuthorizationCode() {
    return !failedPaying() ? '' : CONFIG.authCode;
  }

  function getInstallmentCount() {
    return !failedPaying() ? 0 : CONFIG.installmentCount;
  }

  function getPan() {
    return !failedPaying() ? '' : CONFIG.pan;
  }

  function getType() {
    return !failedPaying() ? '' : CONFIG.type;
  }

  Payment.doPay = params => {
    _isPaying = true;

    Payment.paymentDone();

    _isPaying = false;
    CONFIG.authorizedAmount = params.value;
  };

  Signal.register(Payment, ['cardEvent']);
  Payment.doEnableCardEvent = Signal.noop();
  Payment.doDisableCardEvent = Signal.noop();

  Object.assign(Payment, {
    isPaying,
    failedPaying,
    getCardHolderName,
    getAtk,
    getItk,
    getAuthorizationDateTime,
    getBrand,
    getOrderId,
    getAuthorizationCode,
    getInstallmentCount,
    getPan,
    getType,
    getAuthorizedAmount,
  });
}
