export default function(Network) {
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
}
