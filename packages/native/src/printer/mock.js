export default function(Printer) {
  let _printing = false

  /**
   * Prints an image using the device's printer. Note that the element MUST have a white background color, because
   * on current state of the project, the printer ignores the transparency
   * @memberOf Printer
   * @example
   * const element = document.getElementById('my-div')
   * // Print the element
   * Printer.print(element)
   * // Scale the element to fit the paper width
   * Printer.print(element, {scale_to_paper_width: true})
   * // Do not scale the element and use dithering
   * Printer.print(element, {use_dithering: true})
   * // Print and set a callback
   * function callback(error) {
   *      if (error) {
   *          console.log(error)
   *      } else {
   *          console.log('Success')
   *      }
   * }
   * Printer.print(element, {use_dithering: true, scale_to_paper_width: true}, callback)
   * @param {HTMLElement}   element                               The element to print
   * @param {object}        config                                The configuration object
   * @param {boolean}       [config.scale_to_paper_width=false]   True if the element should be scaled to fit the paper. If the
   *                                                              element is bigger than the paper width, it will resize to fit it
   *                                                              despite the value of this parameter.
   *
   * @param {boolean}       [config.use_dithering=false]          True if a dithering algorithm should be applied to the element.
   *                                                              The dithering is recommended when printing images. Note that the
   *                                                              text will be dithered too, resulting in a 'lower quality' result.
   *
   * @param {printCallback} callback                              The function to call when the print is finished
   */
  function print(element, config, callback) {
    if (typeof callback !== 'function') callback = function() {}

    if (!isPrinting()) {
      if (config === undefined) config = {}
      if (config.scale_to_paper_width === undefined)
        config.scale_to_paper_width = false
      if (config.use_dithering === undefined) config.use_dithering = false

      if (typeof element === 'object') {
        console.log('Printing Image...')
        console.log(element.outerHTML)
        console.log(
          'scale_to_paper_width = ' +
            config.scale_to_paper_width +
            ', use_dithering = ' +
            config.use_dithering,
        )
        console.log(
          'width = ' +
            element.offsetWidth +
            ', height = ' +
            element.offsetHeight,
        )

        if (
          /** Allow 0 width/height elements in JSDOM for testing */
          process.env.NODE_ENV !== 'test' &&
          (element.offsetHeight === 0 || element.offsetWidth === 0)
        ) {
          const error = new Error(
            'The width and height of the element cannot be 0',
          )
          console.error(error)
          callback(error)
        } else {
          _printing = true
          setTimeout(function() {
            _printing = false
            console.log('Finished printing')
            if (Printer.SimulatedConfig.should_fail) {
              const err = new Error('Failed to print')
              callback(err)
            } else {
              callback()
            }
          }, Printer.SimulatedConfig.printing_time)
        }
      } else {
        let error = new Error('BAD USAGE: Element must be an HTMLElement!')
        console.error(error)
        callback(error)
      }
    } else {
      let error = new Error('Printing is already in progress')
      console.warn(error)
      callback(error)
    }
  }

  /**
   * Gets the width of the paper, in pixels
   * @memberOf Printer
   * @example
   * const canvas = document.getElementById('canvas')
   * canvas.width = Printer.getPaperWidth()
   * @example
   * const element = document.getElementById('my-div')
   * element.style.width = Printer.getPaperWidth()
   * @return {number} The width of the paper [pixels]
   */
  function getPaperWidth() {
    return 384
  }

  /**
   * Returns true if is printing
   * @memberOf Printer
   * @return {boolean} True if is printing
   */
  function isPrinting() {
    return _printing
  }

  /**
   * Returns true it the last printing job has failed
   * @return {boolean} True if the last printing job has failed
   */
  function failedPrinting() {
    return Printer.SimulatedConfig.should_fail
  }

  /**
   * Configurations that can be set to simulate the printer state. Note that these
   * variables are used to simulate the device on the browser. To access the real
   * state on the device, use the apropriate methods exposed on the
   * {@link window.Printer} object
   * @namespace PrinterSimulatedConfig
   * @type {object}
   * @memberOf Printer
   * @property {number}   printing_time Time to print [ms]
   * @property {boolean}  should_fail True if the printer should fail
   */
  const SimulatedConfig = {
    printing_time: '2000',
    should_fail: false,
  }

  Object.assign(Printer, {
    print,
    getPaperWidth,
    isPrinting,
    failedPrinting,
    SimulatedConfig,
  })
}
