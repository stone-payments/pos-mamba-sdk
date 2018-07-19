import mock from './mock.js'
import extendNative from './native.js'

let Http = window.$Http

if (process.env.NODE_ENV !== 'production') {
  Http = window.$Http = {}
  mock(Http)
}

if (process.env.NODE_ENV === 'production') {
  extendNative(Http)
}

export default Http
