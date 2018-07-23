import SignalHandler from '../signal/handler.js'

export default function(Http) {
  const HttpSignals = SignalHandler(Http)

  Http.send = function(configParams) {
    return new Promise((resolve, reject) => {
      HttpSignals.once('requestFinished', () => {
        Http.getError() ? reject(Http.getError()) : resolve(Http.getData())
      })

      /** Asynchronously make a request at the backend */
      Http.doSend(configParams)
    })
  }
}
