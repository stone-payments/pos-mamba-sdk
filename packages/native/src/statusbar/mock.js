import { convertColorString } from '../utils/color.js'

export const STATUSBAR_HEIGHT = 20

export default function (StatusBar) {
  let _backgroundColor = '#3DA10F'
  let _el

  /**
   * @memberOf StatusBar
   * @example
   * // All of this set statusbar color to red (not the same red)
   * StatusBar.setBackgroundColor('red')
   * StatusBar.setBackgroundColor('#F44336')
   * StatusBar.setBackgroundColor('rgb(244,67,54)')
   * @param {string} color Color in rgb, hexadecimal format or css class name with background-color defined
   */
  function setBackgroundColor (color) {
    _addStatusbar()
    let colorHex = convertColorString(
      /** Use white for test environments (JSDOM doesn't render anything) */
      process.env.NODE_ENV === 'test' ? '#FFFFFF' : color,
    )

    if (colorHex === 'transparent') {
      console.error("Invalid color format or color class don't exist")
      return
    }

    _backgroundColor = colorHex
    if (_el) _el.style.backgroundColor = _backgroundColor
  }
  /**
   * Get the current statusbar color
   * @memberOf StatusBar
   * @return {string} Current statusbar color in hexadecimal
   */
  function getBackgroundColor (color) {
    return _backgroundColor
  }

  function _addStatusbar () {
    if (_el === undefined) {
      _el = document.createElement('div')
      _el.classList.add('mb-statusbar')
      setBackgroundColor('primary-color-dark')

      document.body.style.paddingTop = STATUSBAR_HEIGHT + 'px'
    }

    if (_el.parentElement === null) {
      document.body.prepend(_el)
    }
  }

  /**
   * Hide the statusbar on the top
   * Applies only for development environment
   * It is not possible to hide it on the POS
   */
  function hideStatusBarDevelopmentOnly () {
    _el.style.display = 'none'
  }

  /**
   * Start page with a rectangle on top representing the statusbar for simulation
   * @ignore
   */
  window.addEventListener('load', function () {
    _addStatusbar()
    setBackgroundColor(_backgroundColor)
  })

  Object.assign(StatusBar, {
    hideStatusBarDevelopmentOnly,
    setBackgroundColor,
    getBackgroundColor,
  })
}
