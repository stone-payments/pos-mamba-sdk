const KEYMAP = Object.freeze({
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

export default function(Keyboard) {
  Keyboard.getKeyCode = keyName =>
    Object.keys(KEYMAP).find(code => KEYMAP[code] === keyName)
  Keyboard.getKeyName = keyCode => KEYMAP[keyCode]
  Keyboard.isNumericKey = keyCode => !isNaN(parseFloat(KEYMAP[keyCode]))
  Keyboard.isActionKey = keyCode => !Keyboard.isNumericKey(keyCode)

  Keyboard.isBackspaceEnabled = true
  Keyboard.disableBackspace = () => {
    Keyboard.isBackspaceEnabled = false
  }
  Keyboard.enableBackspace = () => {
    Keyboard.isBackspaceEnabled = true
  }
}
