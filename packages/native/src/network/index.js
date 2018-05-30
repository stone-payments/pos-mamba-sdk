import mock from './mock.js'
import addSharedTo from './shared.js'
import extendNative from './native.js'

let Network = window.Network

if (process.env.NODE_ENV === 'development') {
  Network = window.Network = {}
  addSharedTo(Network)
  mock(Network)
}

if (process.env.NODE_ENV === 'production') {
  if (!Network) {
    throw new Error("[@mamba/native] 'Network' module not found")
  }
  addSharedTo(Network)
  extendNative(Network)
}

export default Network
