function pickProbableSignal(signals) {
  const winner = Math.random()
  for (let i = 0, threshold = 0; i < signals.length; i++) {
    threshold += parseFloat(signals[i][1])
    if (threshold > winner) {
      return signals[i]
    }
  }
}

export default function(namespace, timeout = 1500) {
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

  function Signal() {
    return {
      callbacks: [],
      connect(callback) {
        this.callbacks.push(callback)
      },
      disconnect(callback) {
        const callbackIndex = this.callbacks.indexOf(callback)
        if (callbackIndex < 0) return
        this.callbacks.splice(callbackIndex, 1)
      },
    }
  }

  SignalEmitter.signals = []

  SignalEmitter.on = function(signalName, probability, transformer) {
    if (SignalEmitter.signals.indexOf(signalName) < 0) {
      SignalEmitter.signals.push([signalName, probability, transformer])
      namespace[signalName] = Signal(signalName)
    }
    return SignalEmitter
  }
  SignalEmitter.add = SignalEmitter.on

  return SignalEmitter
}
