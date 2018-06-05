let isBackspaceEnabled = true
const disableBackspace = event => {
  if (event.keyCode === 8) {
    event.preventDefault()
    return false
  }
}

export default function(Keyboard) {
  Keyboard.disableBackspace = () => {
    if (isBackspaceEnabled) {
      document.addEventListener('keydown', disableBackspace)
      isBackspaceEnabled = false
    }
  }

  Keyboard.enableBackspace = () => {
    if (!isBackspaceEnabled) {
      document.removeEventListener('keydown', disableBackspace)
      isBackspaceEnabled = true
    }
  }

  Keyboard.KEYMAP = Object.freeze({
    13: 'enter',
    8: 'back',
    27: 'close',
    17: 'help',
    16: 'shortcuts',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
  })
}
