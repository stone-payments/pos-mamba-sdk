import { STATUSBAR_HEIGHT } from '../statusbar/mock.js'

function preventDefault(event) {
  event.preventDefault()
}

export default class {
  constructor() {
    this._gif = document.createElement('img')
    this._gif.style.position = 'fixed'
    this._gif.classList.add('mb-global-gif')
    this._cache = {}
    this.hide()
  }

  /**
   * Shows the gif at the specified position.
   * If the x or y positions are negative, the gif will not be shown.
   * Note that when a gif is showing, all the keyboard events will be consumed.
   * This method will also cache the gif
   *
   * @param {string} path The path of the gif, relative to the project root
   * @param {number} [x] Position to place the gif on x axis
   * @param {number} [y] Position to place the gif on y axis
   * @returns {boolean} True if the gif is correctly showing
   * @memberof Gif
   */
  show(path, x, y) {
    console.log(`Gif: Show ${path} at x = ${x} y = ${y}`)

    if (x === undefined && y === undefined) {
      if (this.cache(path)) {
        const gif = this._cache[path]
        x = gif.x
        y = gif.y
      } else {
        x = 0
        y = 0
      }
    }

    if (this.cache(path)) {
      if (this.setPosition(path, x, y)) {
        const gif = this._cache[path]
        this._gif.setAttribute('src', path)
        this._gif.style.display = ''

        // TODO: consume keyboard events
        if (this._gif.parentElement === null) {
          document.body.appendChild(this._gif)
        }

        gif.w = this._gif.offsetWidth
        gif.h = this._gif.offsetHeight
        console.log('set width and height to ', gif.w, gif.h)

        document.addEventListener('keydown', preventDefault)

        return true
      } else {
        this.hide()
      }
    } else {
      console.warn(`Gif: Failed to cache ${path}, will not show it`)
      return false
    }
  }

  /**
   * Sets the gif position
   * This method will also cache the gif
   * If the position x or y is negative, the position will not be set
   *
   * @param {string} path The path of the gif, relative to the project root
   * @param {number} [x] Position to place the gif on x axis
   * @param {number} [y] Position to place the gif on y axis
   * @returns {boolean} True if the position was set correctly
   * @memberof Gif
   */
  setPosition(path, x, y) {
    if (x !== undefined && y !== undefined) {
      if (this.cache(path)) {
        if (x >= 0 && y >= 0) {
          const gif = this._cache[path]
          gif.x = x
          gif.y = y

          this._gif.style.top =
            gif.y + (window['Gif'] === undefined ? STATUSBAR_HEIGHT : 0) + 'px'
          this._gif.style.left = gif.x + 'px'
          return true
        } else {
          console.error(`Gif: Position cannot be negative, x = ${x} y = ${y}`)
        }
      }
    } else {
      console.error(`Gif: Position cannot be undefined, x = ${x} y = ${y}`)
    }

    console.error('Gif: Failed to set position')
    return false
  }

  /**
   * Hides the gif
   *
   * @memberof Gif
   */
  hide() {
    console.log('Gif: Hide gif')
    this._gif.style.display = 'none'
    document.removeEventListener('keydown', preventDefault)
  }

  /**
   * Caches the gif to be used quickly later
   * Note that if the gif is not cached, its x, y, w and h properties will be initialized to 0.
   * To set the position and the dimensions, call the {@link show} method
   *
   * @param {string} path The path of the gif, relative to the project root
   * @returns {boolean} True if the gif was cached correctly
   * @memberof Gif
   */
  cache(path) {
    if (
      typeof path !== 'string' ||
      path.lastIndexOf('.gif') === -1 ||
      path.lastIndexOf('..') !== -1 ||
      path.lastIndexOf('~') !== -1
    ) {
      console.error(`Gif: ${path} is not valid`)
      return false
    }

    if (this._cache[path] === undefined) {
      console.log(`Gif: Caching ${path}`)
      this._cache[path] = {
        x: 0,
        y: 0,
        w: 0,
        h: 0,
      }
    }

    return true
  }

  /**
   * Returns the gif dimensions and position
   *
   * @param {string} path The path of the gif, relative to the project root
   * @returns {IRect} Dimension and position
   * @memberof Gif
   */
  get(path) {
    return this._cache[path]
  }
}
