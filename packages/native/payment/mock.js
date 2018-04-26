export default function (Payment) {
  let _paying = false
  // var _detectCardEventEnabled = false

  /**
   * @callback paymentCallback
   * @memberOf Payment
   * @param {int} amountAuthorized The amount authorized
   */

  /**
   *
   * @memberOf Payment
   * @example
   * var proposedAmount = 100
   * //  Call payment app with a proposed amount
   * Payment.pay(proposedAmount)
   * @example
   * // Call payment app and set a callback
   * function callback(amountAuthorized) {
   *      if (amountAuthorized === 0) {
   *          console.log('Error')
   *      } else {
   *          console.log('Success')
   *      }
   * }
   * Payment.pay(proposedAmount, callback)
   * @param {int}   proposedAmount      Proposed amount to pay
   * @param {paymentCallback} callback  The function to call when the payment is finished
   */
  function pay (proposedAmount, callback) {
    if (typeof callback !== 'function') callback = function () {}
    if (isPaying() === false) {
      if (!isNaN(proposedAmount)) {
        if (proposedAmount >= 0) {
          _paying = true
          // _showPaymentDialog()
          setTimeout(function () {
            _paying = false
            console.log('Payment Finished')
            if (failedPaying()) {
              console.error('Failed to pay')
              callback.call(this, 0)
            } else {
              callback.call(
                this,
                Payment.SimulatedConfigs.amountPaid < 0
                  ? Number(proposedAmount)
                  : Payment.SimulatedConfigs.amountPaid,
              )
            }
          }, Payment.SimulatedConfigs.paymentTime)
        } else {
          console.error('BAD USAGE: Proposed amount must be greater than 0')
          callback.call(this, 0)
        }
      } else {
        console.error('BAD USAGE: Proposed amount must be a number')
        callback.call(this, 0)
      }
    } else {
      console.warn('Payment is already in progress')
      callback.call(this, 0)
    }
  }

  /**
   * Returns true if is paying
   * @memberOf Payment
   * @return {boolean} True if is paying
   */
  function isPaying () {
    return _paying
  }

  /**
   * Returns true it the last payment job has failed
   * @return {boolean} True if the last payment job has failed
   */
  function failedPaying () {
    return Payment.SimulatedConfigs.shouldFail
  }

  /**
   * Turn on detection of card events.
   * @memberOf Payment
   * @example
   * // Turn on detection of card events
   * Payment.enableCardEvent()
   * // Add event listener to card events
   * document.addEventListener('oncardevent', function() {
   *  console.log('Card event detected')
   *  // Call payment app and disable card event detection when payment is done.
   *  Payment.pay(0)
   *  Payment.disableCardEvent()
   * })
   *
   */
  function enableCardEvent () {
    // _detectCardEventEnabled = true
    console.log('Detect card event enabled')
  }

  /**
   * Turn off detection of card events.
   * @memberOf Payment
   */
  function disableCardEvent () {
    // _detectCardEventEnabled = false
    console.log('Detect card event disabled')
  }

  /**
   * Get card holder name in case of payment success.
   * Return empty string if payment failed
   * @memberOf Payment
   * @return {string} cardHolderName
   */
  function getCardHolderName () {
    let cardHolderName = ''
    return !failedPaying() ? cardHolderName : 'SPORTELLO/DOC'
  }

  /**
   * Return the transaction ATK in case of payment success
   * Return mock string with the expected size if payment failed
   * @memberOf Payment
   * @return {string} atk
   */
  function getAtk () {
    let atk = ''
    return !failedPaying() ? atk : '11111111111111'
  }

  /**
   * Return the Authorization Date and Time in case of success
   * Return current Date-Time if payment failed
   * @memberOf Payment
   * @return {Date} authorizationDateTime
   */
  function getAuthorizationDateTime () {
    let authorizationDateTime = null
    return !failedPaying() ? authorizationDateTime : new Date()
  }

  /**
   * Return the card brand in case of success
   * Return empty string if payment failed
   * @memberOf Payment
   * @return {string} brand
   */
  function getBrand () {
    let brand = ''
    return !failedPaying() ? brand : 'bandeiraTeste'
  }

  /**
   * Return the order id in case of success
   * Return empty string if payment failed
   * @memberOf Payment
   * @return {string} orderId
   */
  function getOrderId () {
    let orderId = ''
    return !failedPaying() ? orderId : '111111111'
  }

  /**
   * Return the authorization code in case of success
   * Return empty string if payment failed
   * @memberOf Payment
   * @return {string} authorizationCode
   */
  function getAuthorizationCode () {
    let authorizationCode = ''
    return !failedPaying() ? authorizationCode : '111111111'
  }

  /**
   * Return the number of installments selected, in case of success
   * Return 0 if payment failed
   * @memberOf Payment
   * @return {int} installmentCount
   */
  function getInstallmentCount () {
    let installmentCount = 0
    return !failedPaying() ? installmentCount : 0
  }

  /**
   * Configurations that can be set to simulate the payment state. Note that these
   * variables are used to simulate the device on the browser. To access the real
   * state on the device, use the apropriate methods exposed on the
   * {@link window.Payment} object
   * @namespace PaymentSimulatedConfigurations
   * @type {object}
   * @memberOf Payment
   * @property {number}   paymentTime Time to payment flux [ms]
   * @property {number}   amountPaid  Amount that was paid [cents]. If negative, it will be the same as the proposed amount
   * @property {boolean}  shouldFail  True if the payment should fail
   */
  const SimulatedConfigs = {
    paymentTime: 2000,
    amountPaid: -1,
    shouldFail: false,
  }

  Object.assign(Payment, {
    pay,
    isPaying,
    failedPaying,
    enableCardEvent,
    disableCardEvent,
    getCardHolderName,
    getAtk,
    getAuthorizationDateTime,
    getBrand,
    getOrderId,
    getAuthorizationCode,
    getInstallmentCount,
    SimulatedConfigs,
  })
}
