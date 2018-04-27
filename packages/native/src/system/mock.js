export default function (System) {
  /**
   * The audio context
   * @ignore
   * @type {object}
   */
  const _audioCtx =
    process.env.NODE_ENV !== 'test'
      ? new (window.AudioContext ||
          window.webkitAudioContext ||
          window.audioContext)()
      : {}

  /**
   * Defines the bad usage message
   * @ignore
   * @type {string}
   */
  const _BAD_USAGE = 'Bad Usage'

  /**
   * Defines the default beep duration [ms]
   * @ignore
   * @type {number}
   */
  const _DEFAULT_BEEP_DURATION = 300

  /**
   * Defines the interval to update the time from boot [ms]
   * @ignore
   * @type {number}
   */
  const _UPDATE_TIME_INTERVAL = 1000

  /**
   * Makes a beep sound
   * @param  {number}   duration  Duration of the tone, in milliseconds
   * @param  {number}   frequency Frequency of the tone, in Hz
   * @param  {number}   volume    Volume of the tone. 1 is maximum value, 0 is the minimum (off)
   * @param  {AudioType}   type   The wave type of the tone
   * @param  {Function} callback  Callback to use on end of tone
   */
  function _doBeep (duration, frequency, volume, type, callback) {
    const oscillator = _audioCtx.createOscillator()
    const gainNode = _audioCtx.createGain()

    oscillator.connect(gainNode)
    gainNode.connect(_audioCtx.destination)

    if (volume) {
      gainNode.gain.value = volume
    }
    if (frequency) {
      oscillator.frequency.value = frequency
    }
    if (type) {
      oscillator.type = type
    }
    if (callback) {
      oscillator.onended = callback
    }

    oscillator.start()
    setTimeout(function () {
      oscillator.stop()
    }, duration || _DEFAULT_BEEP_DURATION)
  }

  /**
   * Gets the tone frequency according to the tone
   * @param  {System.Tone} tone   The tone to get the Frequency
   * @return {number}             The frequency in Hz
   */
  function _getToneFrequency (tone) {
    if (tone === System.Tone.TONE1) {
      return 1700
    } else if (tone === System.Tone.TONE2) {
      return 1850
    } else if (tone === System.Tone.TONE3) {
      return 2000
    } else if (tone === System.Tone.TONE4) {
      return 2100
    } else if (tone === System.Tone.TONE5) {
      return 2350
    } else if (tone === System.Tone.TONE6) {
      return 2700
    } else if (tone === System.Tone.TONE7) {
      return 2800
    }
  }

  /**
   * Sets an interval that updates the {@link System.SimulatedConfig.TimeFromBoot}
   * @returns {object} The interval object
   */
  function _setTimeFromBootInterval () {
    return setInterval(function () {
      System.SimulatedConfig.TimeFromBoot += _UPDATE_TIME_INTERVAL
    }, _UPDATE_TIME_INTERVAL)
  }

  /**
   * Start the intervals and call the required functions
   */
  ;(function _init () {
    _setTimeFromBootInterval()
  })()

  /**
   * Performs a beep. Note that this function blocks the execution on the real device
   * until it's finished. If {@link tone} and {@link duration} are both undefined, the default beep
   * will be executed. If the {@link duration} is undefined, the default duration will be used
   * @memberOf System
   * @param  {System.Tone} tone         The tone of the beep
   * @param  {number}      [duration=300]     The duration of the tone in milliseconds
   */
  function beep (tone, duration) {
    if (
      (tone === undefined && duration === undefined) ||
      duration === undefined
    ) {
      tone = System.Tone.TONE1
      duration = _DEFAULT_BEEP_DURATION
    }

    const toneFrequency = _getToneFrequency(tone)

    if (
      toneFrequency !== undefined &&
      duration !== undefined &&
      duration >= 1
    ) {
      console.log('Beep: tone = ' + tone + ', duration = ' + duration)
      _doBeep(duration, toneFrequency, 1, 'square')
    } else {
      console.error('Beep: ' + _BAD_USAGE)
    }
  }

  /**
   * Checks if the device has ethernet
   * @memberOf System
   * @return {boolean} True if the device has ethernet
   */
  function hasEthernet () {
    return System.SimulatedConfig.Connections.ethernet
  }

  /**
   * Checks if the device has wifi
   * @memberOf System
   * @return {boolean} True if the device has wifi
   */
  function hasWifi () {
    return System.SimulatedConfig.Connections.wifi
  }

  /**
   * Checks if the device has gprs
   * @memberOf System
   * @return {boolean} True if the device has gprs
   */
  function hasGprs () {
    return System.SimulatedConfig.Connections.gprs
  }

  /**
   * Checks if the battery is present
   * @memberOf System
   * @return {boolean} True if the battery is present
   */
  function isBatteryPresent () {
    return System.SimulatedConfig.Battery.present
  }

  /**
   * Gets the decive current power supply
   * @memberOf System
   * @return {System.PowerSupply} The current power supply of the device
   */
  function getPowerSupply () {
    return System.SimulatedConfig.PowerSupply
  }

  /**
   * Gets the time from the boot until this moment [ms]
   * @memberOf System
   * @return {number} The time in milliseconds
   */
  function getTimeFromBoot () {
    return System.SimulatedConfig.TimeFromBoot
  }

  /**
   * Gets the serial number of the device
   * @memberOf System
   * @return {string} The serial number
   */
  function getSerialNumber () {
    return System.SimulatedConfig.SerialNumber
  }

  /**
   * Gets the status of the battery
   * @memberOf System
   * @return {System.BatteryStatus} The status of the battery
   */
  function getBatteryStatus () {
    return System.SimulatedConfig.Battery.status
  }

  /**
   * Gets the level of the battery. Note that the level is discrete and it
   * depends on the {@link System.BatteryStatus}. A list of the possible values
   * is stated below:
   * <pre>
   * {@link System.BatteryStatus.CHECK_NOT_SUPPORTED}: 0
   * {@link System.BatteryStatus.IN_CHARGE}: 0
   * {@link System.BatteryStatus.CHARGE_COMPLETE}: 100
   * {@link System.BatteryStatus.DISCHARGE}: 10, 30, 50, 70, 90
   * {@link System.BatteryStatus.ABSENT}: 0
   * </pre>
   * @memberOf System
   * @return {number} The level of the battery
   */
  function getBatteryLevel () {
    return System.SimulatedConfig.Battery.level
  }

  /**
   * Configurations that simulate the device state. Note that it's
   * used to simulate the device on the browser. To access the real
   * state on the device, use the apropriate methods exposed on the
   * {@link System} object
   * @name SimulatedConfig
   * @memberOf System
   * @type {object}
   * @property {object}  Connections                    Connections configuration object
   * @property {boolean} Connections.wifi               True if device has wifi
   * @property {boolean} Connections.ethernet           True if device has ethernet
   * @property {boolean} Connections.gprs               True if device has gprs
   * @property {object}  Battery                        Battery configuration object
   * @property {boolean} Battery.present                True if the battery is present
   * @property {number} Battery.level                   The level of the battery (from 0 to 100)
   * @property {System.BatteryStatus} Battery.status    The status of the battery
   * @property {System.PowerSupply} PowerSupply         Defines the current power supply
   * @property {number} TimeFromBoot                    The time from the boot until this moment [ms]
   * @property {string} SerialNumber                    The serial number of the device
   */
  const SimulatedConfig = {
    Connections: {
      ethernet: true,
      wifi: true,
      gprs: false,
    },
    Battery: {
      present: true,

      level: 50,
      status: System.BatteryStatus.DISCHARGE,
    },
    PowerSupply: System.PowerSupply.USB,
    TimeFromBoot: 0,
    SerialNumber: '00000000',
  }

  Object.assign(System, {
    beep,
    hasEthernet,
    hasWifi,
    hasGprs,
    isBatteryPresent,
    getPowerSupply,
    getTimeFromBoot,
    getSerialNumber,
    getBatteryStatus,
    getBatteryLevel,
    SimulatedConfig,
  })
}
