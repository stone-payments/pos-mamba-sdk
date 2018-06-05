function pickProbableSignal(signals) {
  const winner = Math.random()
  for (let i = 0, threshold = 0; i < signals.length; i++) {
    threshold += parseFloat(signals[i][1])
    if (threshold > winner) {
      return signals[i]
    }
  }
}

function Signal() {
  const callbacks = []
  return {
    callbacks,
    connect(callback) {
      callbacks.push(callback)
    },
    disconnect(callback) {
      const callbackIndex = callbacks.indexOf(callback)
      if (callbackIndex < 0) return
      callbacks.splice(callbackIndex, 1)
    },
  }
}

export default function emitterFactory(namespace, timeout = 1500) {
  function SignalEmitter(...args) {
    setTimeout(() => {
      const [signal, , transformer] = pickProbableSignal(SignalEmitter.signals)
      console.log(`Picked signal: ${signal}`)

      namespace[signal].callbacks.forEach(callback => callback())

      if (typeof transformer === 'function') {
        transformer(...args)
      }
    }, timeout)
  }

  SignalEmitter.signals = []
  SignalEmitter.add = function(signalName, probability, transformer) {
    if (SignalEmitter.signals.indexOf(signalName) < 0) {
      SignalEmitter.signals.push([signalName, probability, transformer])
      namespace[signalName] = Signal(signalName)
    }
    return SignalEmitter
  }

  return SignalEmitter
}
