import mock from './mock.js'
import extendNative from './native.js'

let App = window.App

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  App = window.App = {}
  mock(App)
}

if (process.env.NODE_ENV === 'production') {
  if (!App) {
    throw new Error("[@mamba/native] 'App' module not found")
  }
  extendNative(App)
}

export default App
