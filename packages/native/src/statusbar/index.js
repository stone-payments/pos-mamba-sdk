import mock from './mock.js'
import extendNative from './native.js'

export const STATUSBAR_HEIGHT = 20

let StatusBar = window.StatusBar

if (process.env.NODE_ENV !== 'production') {
  StatusBar = window.StatusBar = {}
  mock(StatusBar)
} else {
  if (!StatusBar) {
    throw new Error("[@mamba/native] 'StatusBar' module not found")
  }
  extendNative(StatusBar)
}

export default StatusBar
