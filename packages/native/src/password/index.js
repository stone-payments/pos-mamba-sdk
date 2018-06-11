import mock from './mock.js'

let Password = window.Password

// TODO: Find where to put this since it's just for a specific app
if (process.env.NODE_ENV !== 'production') {
  Password = window.Password = {}
  mock(Password)
}

if (process.env.NODE_ENV === 'production') {
  Password = window.Password
  if (!Password) {
    throw new Error("[@mamba/native] 'Password' module not found")
  }
}

export default Password
