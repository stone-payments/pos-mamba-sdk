import { convertColorString } from '../utils/color.js'

export default function(StatusBar) {
  StatusBar.setBackgroundColor = function(color) {
    let colorHex = convertColorString(color)

    if (colorHex === 'transparent') {
      console.error("Invalid color format or color class don't exist")
      return
    }

    StatusBar.doSetBackgroundColor(colorHex.replace('#', '0x'))
  }

  StatusBar.getBackgroundColor = function() {
    return '#' + StatusBar.doGetBackgroundColor().toString(16)
  }

  // Init the status bar according to the primary color of the app
  StatusBar.setBackgroundColor('primary-color-dark')
}
