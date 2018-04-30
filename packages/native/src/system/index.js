import mock from './mock.js'
import addSharedTo from './shared.js'

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
}

export default System
