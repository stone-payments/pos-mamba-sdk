import mock from './mock.js'
import addSharedTo from './shared.js'

let Network = window.Network

// TODO: Find where to put this since it's just for a specific app
if (process.env.NODE_ENV !== 'production') {
  Network = window.Network = {}
  addSharedTo(Network)
  mock(Network)
}

if (process.env.NODE_ENV === 'production') {
  if (!Network) {
    throw new Error("[@mamba/native] 'Network' module not found")
  }
  addSharedTo(Network)
}

export default Network
