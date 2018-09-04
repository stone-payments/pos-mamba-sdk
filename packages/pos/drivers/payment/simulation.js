import { State } from '../../simulator/libs/main.js';

export const NAMESPACE = 'Payment';

export const SETTINGS = {
  _isPaying: false,
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

export const SIGNALS = ['cardEvent', 'paymentDone'];

export function setup(Payment) {
  Payment.doPay = params => {
    State.set('Payment._isPaying', true);

    Payment.paymentDone();

    State.set('Payment._isPaying', false);
    State.set('Payment.authorizedAmount', params.amount);
  };

  Payment.doEnableCardEvent = function noop() {};
  Payment.doDisableCardEvent = function noop() {};

  /**
   * Returns true if is paying
   * @memberof Payment
   * @return {boolean} True if is paying
   */
  Payment.isPaying = () => State.get('Payment._isPaying');

  /**
   * Returns true it the last payment job has failed
   * @return {boolean} True if the last payment job has failed
   */
  Payment.failedPaying = () => State.get('Payment.shouldFail');

  /**
   * Get card holder name in case of payment success.
   * Return empty string if payment failed
   * @memberof Payment
   * @return {string} cardHolderName
   */
  Payment.getCardHolderName = () =>
    !Payment.failedPaying() ? '' : State.get('Payment.cardHolderName');

  /**
   * Return the transaction ATK in case of payment success
   * Return mock string with the expected size if payment failed
   * @memberof Payment
   * @return {string} atk
   */
  Payment.getAtk = () =>
    !Payment.failedPaying() ? '' : State.get('Payment.atk');

  /**
   * Return the transaction ITK in case of payment success
   * Return mock string with the expected size if payment failed
   * @memberof Payment
   * @return {string} itk
   */
  Payment.getItk = () =>
    !Payment.failedPaying() ? '' : State.get('Payment.itk');

  /**
   * Return the Authorized Amount in case of success
   * Return 0 if payment failed
   * @memberof Payment
   * @return {number} amount
   */
  Payment.getAuthorizedAmount = () =>
    Payment.failedPaying() ? 0 : State.get('Payment.authorizedAmount');

  /**
   * Return the Authorization Date and Time in case of success
   * Return current Date-Time if payment failed
   * @memberof Payment
   * @return {Date} authorizationDateTime
   */
  Payment.getAuthorizationDateTime = () =>
    !Payment.failedPaying() ? '' : new Date();

  /**
   * Return the card brand in case of success
   * Return empty string if payment failed
   * @memberof Payment
   * @return {string} brand
   */
  Payment.getBrand = () =>
    !Payment.failedPaying() ? '' : State.get('Payment.cardBrand');

  /**
   * Return the order id in case of success
   * Return empty string if payment failed
   * @memberof Payment
   * @return {string} orderId
   */
  Payment.getOrderId = () =>
    !Payment.failedPaying() ? '' : State.get('Payment.orderId');

  /**
   * Return the authorization code in case of success
   * Return empty string if payment failed
   * @memberof Payment
   * @return {string} authorizationCode
   */
  Payment.getAuthorizationCode = () =>
    !Payment.failedPaying() ? '' : State.get('Payment.authCode');

  /**
   * Return the number of installments selected, in case of success
   * Return 0 if payment failed
   * @memberof Payment
   * @return {int} installmentCount
   */
  Payment.getInstallmentCount = () =>
    !Payment.failedPaying() ? 0 : State.get('Payment.installmentCount');

  /**
   * Return the pan in case of success
   * Return empty string if payment failed
   * @memberof Payment
   * @return {string} pan
   */
  Payment.getPan = () =>
    !Payment.failedPaying() ? '' : State.get('Payment.pan');

  /**
   * Return the type transaction in case of success
   * Return empty string if payment failed
   * @memberof Payment
   * @return {string} type
   */
  Payment.getType = () =>
    !Payment.failedPaying() ? '' : State.get('Payment.type');
}
