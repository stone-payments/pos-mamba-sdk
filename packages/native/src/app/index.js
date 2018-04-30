import mock from './mock.js'
import extendNative from './native.js'

let App = window.App

if (process.env.NODE_ENV !== 'production') {
  App = window.App = {}
  mock(App)
} else {
  if (!App) {
    throw new Error("[@mamba/native] 'App' module not found")
  }
  extendNative(App)
}

export default App
