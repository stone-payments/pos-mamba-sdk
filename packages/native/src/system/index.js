import mock from './mock.js'
import extendNative from './native.js'
import addSharedTo from './shared.js'

let System = window.System

if (process.env.NODE_ENV !== 'production') {
  System = window.System = {}
  addSharedTo(System)
  mock(System)
}

if (process.env.NODE_ENV === 'production') {
  if (!System) {
    throw new Error("[@mamba/native] 'System' module not found")
  }
  extendNative(System)
  addSharedTo(System)
}

export default System
