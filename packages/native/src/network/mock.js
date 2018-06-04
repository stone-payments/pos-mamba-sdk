import lastWifiList from './fixtures/lasWifiList'
import SignalEmitter from '../SignalEmitter'

export default function(Network) {
  const MockConfig = {
    connect_should_fail: false,
    forget_should_fail: false,
    get_wifi_list_should_fail: false,
    connect_time: 3000,
    forget_time: 100,
    get_wifi_list_time: 1500,
    wifi_connected: false,
    wifi_enabled: true,
    current_network_adapter: 'wifi',
  }

  Network.doGetWifiList = SignalEmitter(Network, [
    ['getWifiListSuccess', 0.2],
    ['getWifiListFailure', 0.8],
  ])

  function forgetWifi(wifiObject) {
    console.log('forget wifi')

    return new Promise((resolve, reject) => {
      setTimeout(function() {
        if (MockConfig.forget_should_fail) {
          console.log('forget wifi failure')
          reject(new Error(3, Network.Errors[2]))
        } else {
          console.log('forget wifi success')
          /** Update the wifi list */
          lastWifiList.forEach(item => {
            item.saved = item.bssid === wifiObject.bssid ? false : item.saved
            item.connected =
              item.bssid === wifiObject.bssid ? false : item.connected
          })
          resolve()
        }
      }, MockConfig.forget_time)
    }).catch(e => console.log(e))
  }

  function connect(wifiObject) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (MockConfig.connect_should_fail) {
          console.log('connect failure')

          MockConfig.wifi_connected = false

          reject(new Error(0, Network.Errors[0]))
        } else {
          console.log('connect success')

          resolve(wifiObject)

          MockConfig.wifi_enabled = true
          MockConfig.wifi_connected = true

          /** Update the wifi list */
          lastWifiList.forEach(wifi => {
            wifi.connected = wifi.bssid !== wifiObject.bssid
          })
        }
      }, MockConfig.connect_time)
    }).catch(e => console.log(e))
  }

  function hasSavedWifi() {
    return Object.keys(lastWifiList).some(
      wifiKey => lastWifiList[wifiKey].saved,
    )
  }

  function isWifiConnected() {
    return MockConfig.wifi_connected
  }

  function isWifiEnabled() {
    return MockConfig.wifi_enabled
  }

  function enableWifi() {
    console.log('enabled wifi')
    MockConfig.wifi_enabled = true
    MockConfig.wifi_connected = false
  }

  function disableWifi() {
    console.log('disabled wifi')
    MockConfig.wifi_enabled = false
    MockConfig.wifi_connected = false
  }

  function toggleNetworkAdapter() {
    MockConfig.current_network_adapter =
      MockConfig.current_network_adapter === 'wifi' ? 'mbb' : 'wifi'
  }

  function getCurrentNetworkAdapter() {
    return MockConfig.current_network_adapter
  }

  function getLastWifiList() {
    return lastWifiList
  }

  Object.assign(Network, {
    connect,
    isWifiConnected,
    isWifiEnabled,
    enableWifi,
    disableWifi,
    forgetWifi,
    toggleNetworkAdapter,
    getCurrentNetworkAdapter,
    getLastWifiList,
    hasSavedWifi,
    MockConfig,
  })
}
