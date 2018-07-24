/**
 * KeyPress event handler that bypass only numbers
 * @ignore
 * @param  {function} event The KeyPress event
 */
function filterLetters(event) {
  const char = String.fromCharCode(event.keyCode);

  if ('1234567890'.indexOf(char) === -1) {
    event.preventDefault();
  }
}

/**
 * Sets the keyboard to send only numbers. This will affect the whole application
 * @memberof Keyboard
 */
function setKeyboardAsNumeric() {
  console.log('Keyboard is now numeric');
  document.removeEventListener('keypress', filterLetters);
  document.addEventListener('keypress', filterLetters);
}

/**
 * Sets the keyboard to send numbers, letters and symbols. This will
 * affect the whole application
 * @memberof Keyboard
 */
function setKeyboardAsAlphanumeric() {
  console.log('Keyboard is now alphanumeric');
  document.removeEventListener('keypress', filterLetters);
}

export default function (Keyboard) {
  Object.assign(Keyboard, {
    setKeyboardAsNumeric,
    setKeyboardAsAlphanumeric,
  });
}
