export default function(Payment) {
  Payment.currentPaymentDoneCallback = undefined

  Payment.paymentDoneCallback = function() {
    let amoutPaid = Payment.getAmountAuthorized()

    try {
      Payment.paymentDone.disconnect(this, Payment.paymentDoneCallback)
    } catch (err) {
      console.log(err)
    }

    if (typeof Payment.currentPaymentDoneCallback === 'function') {
      Payment.currentPaymentDoneCallback(amoutPaid)
    }

    // Clear the callback
    Payment.currentPaymentDoneCallback = undefined
  }

  Payment.pay = function(params, callback) {
    if (typeof params !== 'object') {
      params = {
        amount: params,
        editable_amount: true,
      }
    }

    if (Payment.isPaying() === false) {
      if (params.amount >= 0) {
        Payment.currentPaymentDoneCallback = callback
        try {
          Payment.paymentDone.disconnect(this, Payment.paymentDoneCallback)
        } catch (err) {
          console.log(err)
        }
        Payment.paymentDone.connect(this, Payment.paymentDoneCallback)
        Payment.doPay(params)
      } else {
        let error = new Error(
          'BAD USAGE: Proposed amount must be greater than 0!',
        )
        console.error(error.msg)
      }
    } else {
      console.warn('Payment is already in progress')
      callback.call(this, 0) // TODO: arguments.callee
    }
  }

  Payment.triggerEvent = function() {
    let event

    event = document.createEvent('CustomEvent')
    event.initCustomEvent('oncardevent', true, true)
    document.dispatchEvent(event)
  }

  Payment.enableCardEvent = function() {
    Payment.doEnableCardEvent()
    try {
      Payment.cardEvent.disconnect(this, Payment.triggerEvent)
    } catch (err) {
      console.log(err)
    }
    Payment.cardEvent.connect(this, Payment.triggerEvent)
  }

  Payment.disableCardEvent = function() {
    Payment.doDisableCardEvent()
    try {
      Payment.cardEvent.disconnect(this, Payment.triggerEvent)
    } catch (err) {
      console.log(err)
    }
  }
}
