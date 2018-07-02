import mock from './mock.js'
import addSharedTo from './shared.js'

let General = window.General

// TODO: Find where to put this since it's just for a specific app
if (process.env.NODE_ENV !== 'production') {
  General = window.General = {}
  mock(General)
  addSharedTo(General)
}

if (process.env.NODE_ENV === 'production') {
  General = window.General
  if (!General) {
    throw new Error("[@mamba/native] 'General' module not found")
  }
  addSharedTo(General)
}

export default General
