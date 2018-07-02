import mock from './mock.js'
import extendNative from './native.js'
import addSharedTo from './shared.js'

let Keyboard = window.Keyboard

if (process.env.NODE_ENV !== 'production') {
  Keyboard = window.Keyboard = {}
  mock(Keyboard)
  addSharedTo(Keyboard)
}

if (process.env.NODE_ENV === 'production') {
  if (!Keyboard) {
    throw new Error("[@mamba/native] 'Keyboard' module not found")
  }
  extendNative(Keyboard)
  addSharedTo(Keyboard)
}

export default Keyboard
