export default function Signal() {
  const callbacks = []
  return {
    fire() {
      callbacks.forEach(callback => callback())
    },
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
