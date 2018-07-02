let lightEnabled = true
const Light = {
  enable() {
    console.log('enabled keyboard light')
    lightEnabled = true
  },
  disable() {
    console.log('disabled keyboard light')
    lightEnabled = false
  },
  isEnabled() {
    return lightEnabled
  },
}

let soundEnabled = true
const Sound = {
  enable() {
    console.log('enabled keyboard sound')
    soundEnabled = false
  },
  disable() {
    console.log('disabled keyboard sound')
    soundEnabled = false
  },

  isEnabled() {
    return soundEnabled
  },
}

/**
 * KeyPress event handler that bypass only numbers
 * @ignore
 * @param  {function} event The KeyPress event
 */
function filterLetters(event) {
  const char = String.fromCharCode(event.keyCode || event.charCode)

  if ('1234567890'.indexOf(char) === -1) {
    event.preventDefault()
  }
}

/**
 * Sets the keyboard to send only numbers. This will affect the whole application
 * @memberOf Keyboard
 */
function setKeyboardAsNumeric() {
  console.log('Keyboard is now numeric')
  document.removeEventListener('keypress', filterLetters)
  document.addEventListener('keypress', filterLetters)
}

/**
 * Sets the keyboard to send numbers, letters and symbols. This will
 * affect the whole application
 * @memberOf Keyboard
 */
function setKeyboardAsAlphanumeric() {
  console.log('Keyboard is now alphanumeric')
  document.removeEventListener('keypress', filterLetters)
}

export default function(Keyboard) {
  Object.assign(Keyboard, {
    Sound,
    Light,
    setKeyboardAsNumeric,
    setKeyboardAsAlphanumeric,
  })
}
