import SignalHandler from '../signal/handler.js'

export default function(Http) {
  const HttpSignals = SignalHandler(Http)

  console.log(`Native: ${Http}`)
  Http.send = function(configParams) {
    /** Call asynchronus send request at the backend */
    Http.doSend(configParams)
    return new Promise((resolve, reject) => {
      console.log(`Promise: ${Http}`)
      HttpSignals.once('requestFinished', () => {
        Http.getError() ? reject(Http.getError()) : resolve(Http.getData())
      })
    })
  }
}
