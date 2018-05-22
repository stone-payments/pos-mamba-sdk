import mock from './mock.js'
import addSharedTo from './shared.js'
import extendNative from './native.js'

let System = window.System

if (process.env.NODE_ENV !== 'production') {
  System = window.System = {}
  addSharedTo(System)
  mock(System)
} else {
  if (!System) {
    throw new Error("[@mamba/native] 'System' module not found")
  }
  addSharedTo(System)
  extendNative(System)
}

export default System
