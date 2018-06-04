import SignalHandler from '../SignalHandler'

export default function(Network) {
  const NetworkSignals = SignalHandler(Network)

  Network.SignalStrength = Object.freeze({
    HIGH: 4,
    MED_HIGH: 3,
    MED_LOW: 2,
    LOW: 1,
    NO_SIGNAL: 0,
  })

  Network.ConnectionTypes = Object.freeze({
    WIFI: 'wifi',
    MBB: 'mbb',
  })

  Network.Errors = Object.freeze({
    0: 'Erro ao conectar à rede wifi',
    1: 'Erro ao conectar à rede móvel',
    2: 'Erro ao esquecer rede wifi',
    3: 'Erro ao procurar redes wifi',
  })

  /** Return the current wifi list */
  Network.getWifiList = function() {
    console.log('get wifilist')
    return new Promise((resolve, reject) => {
      const onSuccess = () => {
        console.log('get wifi SUCCESS')
        let data = Network.getLastWifiList()
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

      NetworkSignals.race([
        ['getWifiListSuccess', onSuccess],
        ['getWifiListFailure', onFailure],
      ])

      // TODO: investigar porque retorna '' as vezes
      setTimeout(() => Network.doGetWifiList())
    })
  }

  /** Connect to a wifi */
  Network.connect = function(wifiObject) {
    return new Promise((resolve, reject) => {
      NetworkSignals.race([
        ['connectSuccess', resolve],
        ['connectFailure', reject],
      ])
      Network.doConnectWifi(wifiObject)
    })
  }

  /** Forget a specific wifi */
  Network.forgetWifi = function(wifiObject) {
    return new Promise((resolve, reject) => {
      NetworkSignals.race([
        ['forgetSuccess', resolve],
        ['forgetFailure', () => reject(new Error(2, Network.Errors[2]))],
      ])
      Network.doForgetWifi(wifiObject)
    })
  }
}
