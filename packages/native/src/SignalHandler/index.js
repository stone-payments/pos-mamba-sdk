class SignalHandler {
  constructor(namespace) {
    this.signals = {}
    this.namespace = namespace
  }

  on(signalName, callback) {
    if (typeof callback === 'function') {
      this.namespace[signalName].connect(callback)
      this.signals[signalName] = callback
    }
    return this
  }

  off(signalName, callback) {
    try {
      this.namespace[signalName].disconnect(
        typeof callback === 'function' ? callback : this.signals[signalName],
      )
      this.signals[signalName] = null
    } catch (e) {
      console.error(e)
    }
    return this
  }

  once(signalName, callback) {
    return this.race([[signalName, callback]])
  }

  race(entries) {
    const wrappedCallbacks = {}
    entries.forEach(([signalName, callback]) => {
      console.log(`connecting once ${signalName}`)

      /** If the signal's slot is already filled with a callback, disconnect it */
      if (this.signals[signalName]) {
        this.off(signalName)
      }

      /** Wrap the signal callback to disconnect all slots once one of the signals are emitted */
      wrappedCallbacks[signalName] = () => {
        callback()
        Object.keys(wrappedCallbacks).forEach(signalName => {
          console.log(`Removing ${signalName}`)
          this.off(signalName, wrappedCallbacks[signalName])
        })
      }

      /** Listen to the signal emission */
      this.on(signalName, wrappedCallbacks[signalName])
    })

    return this
  }
}

export default function(signal) {
  return new SignalHandler(signal)
}
