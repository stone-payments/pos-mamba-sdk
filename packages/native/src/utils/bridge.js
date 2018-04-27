/**
 * @namespace Bridge
 */

/**
 * Definition of the possible link options
 * @memberOf Bridge
 * @name LinkOptions
 * @type {object}
 * @property {string} name The name of the function to create
 * @property {object} injectedObject The object that was injected on the JS
 * @property {function} realFunction The function that must be called to process the job asynchronously. It must return true if there was no problem and the job will be executed
 * @property {function} failedProcessingFunction The function that must be called to know if there was an error. Must return true if there as an error
 * @property {function} getDataFunction The function that gets the processed data
 * @property {function} signal  The signal to connect and disconnect. It's called when the job is done
 * @property {function} validateFunction The function that validades the parameters. Must return true if the arguments are valid
 * @property {string} errorMessage The error message to use in case of error
 * @property {string} progressErrorMessage The error message to use if the job is already in progress
 */

/**
 * Links a function correctly to the backend
 * @param {LinkOptions} options The options to use
 */
function link (options) {
  options.injectedObject[options.name] = function () {
    let callback
    let jobDoneCallback = function () {
      try {
        options.signal.disconnect(this, jobDoneCallback)
      } catch (err) {
        console.log(err)
      }

      let error

      if (
        typeof options.failedProcessingFunction === 'function' &&
        options.failedProcessingFunction()
      ) {
        error = new Error(options.errorMessage)
      }

      if (typeof callback === 'function') {
        callback.call(this, options.getDataFunction(), error)
      }
    }

    if (options.validateFunction.apply(this, arguments)) {
      let lastIndex = arguments.length - 1
      let tempCallback

      if (lastIndex >= 0 && typeof arguments[lastIndex] === 'function') {
        tempCallback = arguments[lastIndex]
      } else {
        tempCallback = undefined
      }
      // Execute the function and check if there was an error. If the return is true, bind
      // the callback and the signal. Otherwise, call the callback passing an error
      if (options.realFunction.apply(this, arguments)) {
        callback = tempCallback
        options.signal.connect(this, jobDoneCallback)
      } else {
        tempCallback.call(
          this,
          undefined,
          new Error(options.progressErrorMessage),
        )
      }
    }
  }
}

export default {
  link,
}
