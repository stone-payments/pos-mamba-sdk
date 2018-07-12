import SignalHandler from '../signal/handler.js'

export default function(Http) {
  const HttpSignals = SignalHandler(Http)

  Http.send = function(configParams, onSendDoneCallback) {
    /** Prepare handler for the callback result signal */
    if (typeof onSendDoneCallback === 'function') {
      HttpSignals.once('sendDoneCallback', () => {
        onSendDoneCallback(Http.getData(), Http.getError())
      })
    }

    /** Call asynchronus send request at the backend */
    Http.doSend(configParams)
  }
}
