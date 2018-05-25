export default function(Network) {
  function disconnectConnectCallbacks() {
    try {
      Network.connectSuccess.disconnect(this, connectSuccessCallback)
    } catch (e) {
      console.log(e)
    }
    try {
      Network.connectFailure.disconnect(this, connectFailureCallback)
    } catch (e) {
      console.log(e)
    }
  }

  function connectSuccessCallback() {
    if (typeof Network.connectCallback === 'function') {
      Network.connectCallback()
    }
  }

  function connectFailureCallback() {
    if (typeof Network.connectCallback === 'function') {
      let err = new Error(0, 'Erro ao conectar')

      Network.connectCallback(err)
    }
  }

  function connectConnectCallbacks(callback) {
    Network.connectCallback = callback
    Network.connectSuccess.connect(this, connectSuccessCallback)
    Network.connectFailure.connect(this, connectFailureCallback)
  }

  Network.connect = function(wifiObject, callback) {
    if (wifiObject === undefined) wifiObject = {}

    disconnectConnectCallbacks()
    connectConnectCallbacks(callback)

    Network.doConnectWifi(wifiObject)
  }

  Network.forgetWifi = function(wifiObject, callback) {
    if (typeof callback !== 'function') callback = function() {}

    Network.forgetSuccess.connect(this, callback)
    Network.forgetFailure.connect(this, function() {
      let err = new Error(2, Network.Errors[2])
      callback(err)
    })

    Network.doForgetWifi(wifiObject)
  }

  Network.reconnect = function(callback) {
    console.log('reconnect')

    disconnectConnectCallbacks()
    connectConnectCallbacks(callback)

    Network.doReconnect()
  }

  Network.connectToMBB = function(callback) {
    console.log('connect to mbb')

    disconnectConnectCallbacks()
    connectConnectCallbacks(callback)

    Network.doConnectToMBB()
  }

  Network.connectToWifi = function(callback) {
    console.log('connect to wifi')

    disconnectConnectCallbacks()
    connectConnectCallbacks(callback)

    Network.doConnectToWifi()
  }

  Network.getWifiList = function(callback) {
    console.log('get wifi list')

    if (typeof callback !== 'function') callback = function() {}

    Network.getWifiListSuccess.connect(this, function() {
      callback(undefined, Network.getLastWifiList())
    })

    Network.getWifiListFailure.connect(this, function() {
      let err = new Error(3, Network.Errors[3])
      callback(err)
    })

    Network.doGetWifiList()
  }
}
