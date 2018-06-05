import mock from './mock.js'
import extendNative from './native.js'

let StatusBar = window.StatusBar

if (process.env.NODE_ENV !== 'production') {
  StatusBar = window.StatusBar = {}
  mock(StatusBar)
}

if (process.env.NODE_ENV === 'production') {
  if (!StatusBar) {
    throw new Error("[@mamba/native] 'StatusBar' module not found")
  }
  extendNative(StatusBar)
}

export default StatusBar
