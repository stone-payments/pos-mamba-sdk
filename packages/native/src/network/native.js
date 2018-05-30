import SignalHandler from '../SignalHandler'

export default function(Network) {
  const NetworkSignals = SignalHandler(Network)

  Network.connect = function(wifiObject, callback) {
    if (wifiObject === undefined) {
      wifiObject = {}
    }
    NetworkSignals.once([
      ['connectSuccess', callback],
      ['connectFailure', callback],
    ])
    Network.doConnectWifi(wifiObject)
  }

  Network.forgetWifi = function(wifiObject, callback) {
    if (typeof callback !== 'function') callback = function() {}

    Network.forgetSuccess.connect(callback)
    Network.forgetFailure.connect(function() {
      let err = new Error(2, Network.Errors[2])
      callback(err)
    })

    Network.doForgetWifi(wifiObject)
  }

  Network.reconnect = function(callback) {
    console.log('reconnect')
    NetworkSignals.once([
      ['connectSuccess', callback],
      ['connectFailure', callback],
    ])
    Network.doReconnect()
  }

  Network.connectToMBB = function(callback) {
    console.log('connect to mbb')
    NetworkSignals.once([
      ['connectSuccess', callback],
      ['connectFailure', callback],
    ])
    Network.doConnectToMBB()
  }

  Network.connectToWifi = function(callback) {
    console.log('connect to wifi')

    NetworkSignals.once([
      ['connectSuccess', callback],
      ['connectFailure', callback],
    ])

    Network.doConnectToWifi()
  }

  Network.getWifiList = function() {
    console.log('get wifilist')
    return new Promise((resolve, reject) => {
      const onSuccess = () => {
        console.log('get wifi SUCCESS')
        let data = Network.getLastWifiList()
        console.log(data)
        data = data.sort((a, b) => {
          if (a.connected || a.strength > b.strength) return -1
          if (b.connected || a.strength < b.strength) return 1
          return 0
        })
        resolve(data)
      }

      const onFailure = () => {
        console.log('get wifi FAILED')
        reject(new Error(3, Network.Errors[3]))
      }

      NetworkSignals.once([
        ['getWifiListSuccess', onSuccess],
        ['getWifiListFailure', onFailure],
      ])

      // TODO: investigar porque retorna '' as vezes
      setTimeout(() => Network.doGetWifiList())
    })
  }
}
