import SignalHandler from '../SignalHandler'

export default function(General) {
  const GeneralSignals = SignalHandler(General)

  GeneralSignals.on('onFactoryResetEnd', () => {
    General.reboot()
  })
}
