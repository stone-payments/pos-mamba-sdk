import mock from './mock.js'
import addSharedTo from './shared.js'

let System = window.System

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  System = window.System = {}
  addSharedTo(System)
  mock(System)
}

if (process.env.NODE_ENV === 'production') {
  if (!System) {
    throw new Error("[@mamba/native] 'System' module not found")
  }
  addSharedTo(System)
}

export default System
