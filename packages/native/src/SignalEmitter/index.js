function pickProbableSlot(signals) {
  const winner = Math.random()
  for (let i = 0, threshold = 0; i < signals.length; i++) {
    threshold += parseFloat(signals[i][1])
    if (threshold > winner) {
      return signals[i][0]
    }
  }
}

export default function(namespace, possibleSignals) {
  function SignalEmitter(resultSignal, timeout = 3000) {
    setTimeout(() => SignalEmitter.emit(resultSignal), timeout)
  }

  SignalEmitter.emit = (resultSignal = null) => {
    if (!resultSignal) {
      resultSignal = pickProbableSlot(possibleSignals)
    }
    console.log(`Picked signal: ${resultSignal}`)
    namespace[resultSignal].callbacks.forEach(callback => callback())
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

  possibleSignals.forEach(([signalName]) => {
    namespace[signalName] = Signal(signalName)
  })

  return SignalEmitter
}
