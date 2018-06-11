import lastWifiList from './fixtures/lasWifiList'
import SignalEmitter from '../SignalEmitter'

/** Mock config */
const MockConfig = {
  wifi_connected: false,
  wifi_enabled: true,
  current_network_adapter: 'wifi',
}

function hasSavedWifi() {
  return Object.keys(lastWifiList).some(wifiKey => lastWifiList[wifiKey].saved)
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

export default function(Network) {
  /** Register Signal Emitters and it's possible signals */
  Network.doGetWifiList = SignalEmitter(Network)
    .add('getWifiListSuccess', 0.8)
    .add('getWifiListFailure', 0.2)

  Network.doForgetWifi = SignalEmitter(Network)
    .add('forgetSuccess', 0.9, wifiObject => {
      lastWifiList.forEach(item => {
        item.saved = item.bssid === wifiObject.bssid ? false : item.saved
        item.connected =
          item.bssid === wifiObject.bssid ? false : item.connected
      })
    })
    .add('forgetFailure', 0.1)

  Network.doConnectWifi = SignalEmitter(Network)
    .add('connectSuccess', 0.9, wifiObject => {
      MockConfig.wifi_enabled = true
      MockConfig.wifi_connected = true

      /** Update the wifi list */
      lastWifiList.forEach(wifi => {
        wifi.connected = wifi.bssid !== wifiObject.bssid
      })
    })
    .add('connectFailure', 0.1, () => {
      MockConfig.wifi_connected = false
    })

  Object.assign(Network, {
    isWifiConnected,
    isWifiEnabled,
    enableWifi,
    disableWifi,
    toggleNetworkAdapter,
    getCurrentNetworkAdapter,
    getLastWifiList,
    hasSavedWifi,
    MockConfig,
  })
}
