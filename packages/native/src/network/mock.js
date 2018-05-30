import lastWifiList from './fixtures/lasWifiList'

export default function(Network) {
  console.log(lastWifiList)

  function connect(callback) {
    if (typeof callback !== 'function') callback = function() {}

    console.log('connecting')
    if (Network.SimulatedConfig.connect_should_fail) {
      console.log('connect failure')
      setTimeout(function() {
        callback(new Error(0, Network.Errors[0]))
      }, Network.SimulatedConfig.connect_time)

      Network.SimulatedConfig.wifi_connected = false
    } else {
      console.log('connect success')
      setTimeout(callback, Network.SimulatedConfig.connect_time)
      Network.SimulatedConfig.wifi_enabled = true
      Network.SimulatedConfig.wifi_connected = true
    }
  }

  function hasSavedWifi() {
    return true
  }

  function connectToMBB(callback) {
    if (typeof callback !== 'function') callback = function() {}

    if (Network.SimulatedConfig.connect_should_fail) {
      console.log('connect to mbb failure')
      setTimeout(function() {
        callback(new Error(0, Network.Errors[1]))
      }, Network.SimulatedConfig.connect_time)
    } else {
      console.log('connect to mbb success')
      setTimeout(callback, Network.SimulatedConfig.connect_time)
      // Network.SimulatedConfig.current_connection = ConnectionTypes.MBB;
      Network.SimulatedConfig.wifi_connected = false
    }
  }

  function connectToWifi(callback) {
    if (typeof callback !== 'function') callback = function() {}

    if (Network.SimulatedConfig.connect_should_fail) {
      console.log('connect to wifi failure')
      setTimeout(function() {
        callback(new Error(0, Network.Errors[1]))
      }, Network.SimulatedConfig.connect_time)
    } else {
      console.log('connect to wifi success')
      setTimeout(callback, Network.SimulatedConfig.connect_time)
      // Network.SimulatedConfig.current_connection = ConnectionTypes.MBB;
      Network.SimulatedConfig.wifi_connected = true
    }
  }

  function getWifiList(callback) {
    return new Promise((resolve, reject) => {
      if (Network.SimulatedConfig.get_wifi_list_should_fail) {
        console.log('get wifi list failure')
        setTimeout(function() {
          reject(new Error(3, Network.Errors[3]))
        }, Network.SimulatedConfig.get_wifi_list_time)
      } else {
        console.log('get wifi list success')
        setTimeout(function() {
          resolve(lastWifiList)
        }, Network.SimulatedConfig.get_wifi_list_time)
      }
    }).catch(e => console.log(e))
  }

  function isWifiConnected() {
    return Network.SimulatedConfig['wifi_connected']
  }

  function isWifiEnabled() {
    return Network.SimulatedConfig['wifi_enabled']
  }

  function enableWifi() {
    console.log('enabled wifi')
    Network.SimulatedConfig['wifi_enabled'] = true
    Network.SimulatedConfig['wifi_connected'] = false
  }

  function disableWifi() {
    console.log('disabled wifi')
    Network.SimulatedConfig['wifi_enabled'] = false
    Network.SimulatedConfig['wifi_connected'] = false
  }

  function forgetWifi(wifiObject, callback) {
    if (typeof callback !== 'function') callback = function() {}

    console.log('forget wifi')
    if (Network.SimulatedConfig.forget_should_fail) {
      setTimeout(function() {
        let err = new Error(2, Network.Errors[2])
        callback(err)
      }, Network.SimulatedConfig.forget_time)
    } else {
      for (let i = 0; i < lastWifiList.length; i++) {
        if (lastWifiList[i].ssid === wifiObject.ssid) {
          lastWifiList[i].saved = false
          break
        }
      }
      setTimeout(callback, Network.SimulatedConfig.forget_time)
    }
  }

  function toggleNetworkAdapter() {
    if (Network.SimulatedConfig.current_network_adapter === 'wifi')
      Network.SimulatedConfig.current_network_adapter = 'mbb'
    else Network.SimulatedConfig.current_network_adapter = 'wifi'
  }

  function getCurrentNetworkAdapter() {
    return Network.SimulatedConfig.current_network_adapter
  }

  function getLastWifiList() {
    return lastWifiList
  }

  const SimulatedConfig = {
    connect_should_fail: false,
    forget_should_fail: false,
    get_wifi_list_should_fail: false,
    connect_time: 1000,
    forget_time: 100,
    get_wifi_list_time: 1500,
    wifi_connected: false,
    wifi_enabled: true,
    current_network_adapter: 'wifi',
  }

  Object.assign(Network, {
    connect,
    getWifiList,
    isWifiConnected,
    isWifiEnabled,
    enableWifi,
    disableWifi,
    forgetWifi,
    connectToMBB,
    connectToWifi,
    toggleNetworkAdapter,
    getCurrentNetworkAdapter,
    getLastWifiList,
    hasSavedWifi,
    SimulatedConfig,
  })
}
