import mock from './mock.js'
import extendNative from './native.js'
import addSharedTo from './shared.js'

/**
 * Initialize empty object because window.Screen don't exist
 * TODO: Debate and organize native modules
 * */
let Screen = window.Screen

if (process.env.NODE_ENV !== 'production') {
  Screen = window.Screen = {}
  mock(Screen)
  addSharedTo(Screen)
}

if (process.env.NODE_ENV === 'production') {
  Screen = window.Screen = {}
  if (!Screen) {
    throw new Error("[@mamba/native] 'Screen' module not found")
  }
  extendNative(Screen)
  addSharedTo(Screen)
}

export default Screen
