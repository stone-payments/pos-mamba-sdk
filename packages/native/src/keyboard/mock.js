export default function(Keyboard) {
  const _numbers = '1234567890'

  /**
   * KeyPress event handler that bypass only numbers
   * @ignore
   * @param  {function} event The KeyPress event
   */
  function _filterLetters(event) {
    const char = String.fromCharCode(event.keyCode || event.charCode)

    if (_numbers.indexOf(char) === -1) {
      event.preventDefault()
    }
  }

  /**
   * Sets the keyboard to send only numbers. This will affect the whole application
   * @memberOf Keyboard
   */
  function setKeyboardAsNumeric() {
    console.log('Keyboard is now numeric')
    document.removeEventListener('keypress', _filterLetters)
    document.addEventListener('keypress', _filterLetters)
  }

  /**
   * Sets the keyboard to send numbers, letters and symbols. This will
   * affect the whole application
   * @memberOf Keyboard
   */
  function setKeyboardAsAlphanumeric() {
    console.log('Keyboard is now alphanumeric')
    document.removeEventListener('keypress', _filterLetters)
  }

  Object.assign(Keyboard, {
    setKeyboardAsNumeric,
    setKeyboardAsAlphanumeric,
  })
}
