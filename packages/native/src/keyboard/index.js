import mock from './mock.js'
import extendNative from './native.js'

let Keyboard = window.Keyboard

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  Keyboard = window.Keyboard = {}
  mock(Keyboard)
}

if (process.env.NODE_ENV === 'production') {
  if (!Keyboard) {
    throw new Error("[@mamba/native] 'Keyboard' module not found")
  }
  extendNative(Keyboard)
}

export default Keyboard

export const KEYMAP = {
  13: 'enter',
  8: 'back',
  27: 'close',
  17: 'help',
  16: 'shortcuts',
}
