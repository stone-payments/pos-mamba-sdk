/**
 * Get background color from css class
 * @ignore
 * @param  {string} classes
 * @return {string} color in hexadecimal
 */
export function getColorFromClass(classes) {
  let dummy = document.createElement('div')
  dummy.classList.add(classes)
  document.body.appendChild(dummy)
  let color = window.getComputedStyle(dummy).backgroundColor
  document.body.removeChild(dummy)
  return rgb2hex(color)
}

/**
 * Convert color to hexadecimal format
 * @ignore
 * @param  {string} color Color in rgb, hexadecimal format or css class name with background-color defined
 */
export function convertColorString(color) {
  let colorHex

  if (
    color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/) !== null ||
    color.indexOf('#') > -1
  ) {
    colorHex = rgb2hex(color)
  } else {
    colorHex = getColorFromClass(color)
  }
  return colorHex
}

function hex(x) {
  return ('0' + parseInt(x).toString(16)).slice(-2)
}

/**
 * Convert color in format rgb to hexadecimal
 * @ignore
 * @param  {function} rgb String in the rbg format
 * @return {string} color in hexadecimal
 */
export function rgb2hex(rgb) {
  if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb

  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
}
