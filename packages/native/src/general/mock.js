import SignalEmitter from '../SignalEmitter'

function reboot() {
  console.log('Reboot POS')
}

export default function(General) {
  const factoryReset = SignalEmitter(General).add('onFactoryResetEnd', 1)

  Object.assign(General, {
    factoryReset,
    reboot,
  })
}
