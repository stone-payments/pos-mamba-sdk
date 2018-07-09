export default function signalFactory() {
  const callbacks = []
  const Signal = () => callbacks.forEach(callback => callback())

  Signal.connect = callback => callbacks.push(callback)
  Signal.disconnect = callback => {
    const callbackIndex = callbacks.indexOf(callback)
    if (callbackIndex < 0) return
    callbacks.splice(callbackIndex, 1)
  }

  return Signal
}
