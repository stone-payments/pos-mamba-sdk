/**
 * Defines the default beep duration [ms]
 * @ignore
 * @type {number}
 */
const DEFAULT_BEEP_DURATION = 300;

/**
 * Audio context for simulating POS beeps.
 * Instantiated once by the {@link doBeep}
 */
let audioCtx;

/**
 * Makes a beep sound
 * @param  {number}   duration  Duration of the tone, in milliseconds
 * @param  {number}   frequency Frequency of the tone, in Hz
 */
function doBeep(duration, frequency) {
  if (typeof audioCtx === 'undefined') {
    audioCtx = new window.AudioContext();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  gainNode.gain.value = 1; // Volume
  oscillator.frequency.value = frequency;
  oscillator.type = 'square';

  oscillator.start();
  setTimeout(() => oscillator.stop(), duration);
}

export default function(System) {
  /**
   * Configurations that simulate the device state. Note that it's
   * used to simulate the device on the browser. To access the real
   * state on the device, use the apropriate methods exposed on the
   * {@link System} object
   * @name MockConfig
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
  /** Mock config */
  const MockConfig = {
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
  };

  /**
   * Sets an interval that updates the {@link MockConfig.TimeFromBoot}
   * @returns {object} The interval object
   */
  setInterval(() => {
    MockConfig.TimeFromBoot += 1000;
  }, 1000);

  /**
   * Checks if the device has ethernet
   * @memberOf System
   * @return {boolean} True if the device has ethernet
   */
  function hasEthernet() {
    return MockConfig.Connections.ethernet;
  }

  /**
   * Checks if the device has wifi
   * @memberOf System
   * @return {boolean} True if the device has wifi
   */
  function hasWifi() {
    return MockConfig.Connections.wifi;
  }

  /**
   * Checks if the device has gprs
   * @memberOf System
   * @return {boolean} True if the device has gprs
   */
  function hasGprs() {
    return MockConfig.Connections.gprs;
  }

  /**
   * Checks if the battery is present
   * @memberOf System
   * @return {boolean} True if the battery is present
   */
  function isBatteryPresent() {
    return MockConfig.Battery.present;
  }

  /**
   * Gets the decive current power supply
   * @memberOf System
   * @return {System.PowerSupply} The current power supply of the device
   */
  function getPowerSupply() {
    return MockConfig.PowerSupply;
  }

  /**
   * Gets the time from the boot until this moment [ms]
   * @memberOf System
   * @return {number} The time in milliseconds
   */
  function getTimeFromBoot() {
    return MockConfig.TimeFromBoot;
  }

  /**
   * Gets the serial number of the device
   * @memberOf System
   * @return {string} The serial number
   */
  function getSerialNumber() {
    return MockConfig.SerialNumber;
  }

  /**
   * Gets the status of the battery
   * @memberOf System
   * @return {System.BatteryStatus} The status of the battery
   */
  function getBatteryStatus() {
    return MockConfig.Battery.status;
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
  function getBatteryLevel() {
    return MockConfig.Battery.level;
  }

  /**
   * Gets the tone frequency according to the tone
   * @param  {System.Tone} tone   The tone to get the Frequency
   * @return {number}             The frequency in Hz
   */
  function getToneFrequency(tone) {
    if (tone === System.Tone.TONE1) return 1700;
    if (tone === System.Tone.TONE2) return 1850;
    if (tone === System.Tone.TONE3) return 2000;
    if (tone === System.Tone.TONE4) return 2100;
    if (tone === System.Tone.TONE5) return 2350;
    if (tone === System.Tone.TONE6) return 2700;
    if (tone === System.Tone.TONE7) return 2800;
    return null;
  }

  /**
   * Performs a beep. Note that this function blocks the execution on the real device
   * until it's finished. If {@link tone} and {@link duration} are both undefined, the default beep
   * will be executed. If the {@link duration} is undefined, the default duration will be used
   * @memberOf System
   * @param  {System.Tone} tone         The tone of the beep
   * @param  {number}      [duration=300]     The duration of the tone in milliseconds
   */
  function beep(tone = System.Tone.TONE1, duration = DEFAULT_BEEP_DURATION) {
    const toneFrequency = getToneFrequency(tone);

    if (toneFrequency) {
      console.log(`Beep: tone = ${tone}, duration = ${duration}`);
      if (process.env.NODE_ENV !== 'test') {
        doBeep(duration, toneFrequency);
      }
    } else {
      console.error('Beep: Bad Usage');
    }
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
  });
}
