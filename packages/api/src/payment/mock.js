import Signal from '@mambasdk/signal/src/index.js';

const MockConfig = {
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

let _isPaying = false;

/**
 * Returns true if is paying
 * @memberof Payment
 * @return {boolean} True if is paying
 */
function isPaying() {
  return _isPaying;
}

/**
 * Returns true it the last payment job has failed
 * @return {boolean} True if the last payment job has failed
 */
function failedPaying() {
  return MockConfig.shouldFail;
}

/**
 * Get card holder name in case of payment success.
 * Return empty string if payment failed
 * @memberof Payment
 * @return {string} cardHolderName
 */
function getCardHolderName() {
  return !failedPaying() ? '' : MockConfig.cardHolderName;
}

/**
 * Return the transaction ATK in case of payment success
 * Return mock string with the expected size if payment failed
 * @memberof Payment
 * @return {string} atk
 */
function getAtk() {
  return !failedPaying() ? '' : MockConfig.atk;
}

/**
 * Return the transaction ITK in case of payment success
 * Return mock string with the expected size if payment failed
 * @memberof Payment
 * @return {string} itk
 */
function getItk() {
  return !failedPaying() ? '' : MockConfig.itk;
}

/**
 * Return the Authorized Amount in case of success
 * Return 0 if payment failed
 * @memberof Payment
 * @return {number} amount
 */
function getAuthorizedAmount() {
  return failedPaying() ? 0 : MockConfig.authorizedAmount;
}

/**
 * Return the Authorization Date and Time in case of success
 * Return current Date-Time if payment failed
 * @memberof Payment
 * @return {Date} authorizationDateTime
 */
function getAuthorizationDateTime() {
  return !failedPaying() ? '' : new Date();
}

/**
 * Return the card brand in case of success
 * Return empty string if payment failed
 * @memberof Payment
 * @return {string} brand
 */
function getBrand() {
  return !failedPaying() ? '' : MockConfig.cardBrand;
}

/**
 * Return the order id in case of success
 * Return empty string if payment failed
 * @memberof Payment
 * @return {string} orderId
 */
function getOrderId() {
  const orderId = '';
  return !failedPaying() ? orderId : MockConfig.orderId;
}

/**
 * Return the authorization code in case of success
 * Return empty string if payment failed
 * @memberof Payment
 * @return {string} authorizationCode
 */
function getAuthorizationCode() {
  return !failedPaying() ? '' : MockConfig.authCode;
}

/**
 * Return the number of installments selected, in case of success
 * Return 0 if payment failed
 * @memberof Payment
 * @return {int} installmentCount
 */
function getInstallmentCount() {
  return !failedPaying() ? 0 : MockConfig.installmentCount;
}

/**
 * Return the pan in case of success
 * Return empty string if payment failed
 * @memberof Payment
 * @return {string} pan
 */
function getPan() {
  return !failedPaying() ? '' : MockConfig.pan;
}

/**
 * Return the type transaction in case of success
 * Return empty string if payment failed
 * @memberof Payment
 * @return {string} type
 */
function getType() {
  return !failedPaying() ? '' : MockConfig.type;
}

export default function (Payment) {
  Payment.doPay = (params) => {
    _isPaying = true;

    Payment.paymentDone();

    _isPaying = false;
    MockConfig.authorizedAmount = params.value;
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
