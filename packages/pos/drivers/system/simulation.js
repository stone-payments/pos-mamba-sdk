import { error, log } from '../../simulator/libs/utils.js';
import { State } from '../../simulator/libs/main.js';
import systemEnums from './enums.js';

export const NAMESPACE = 'System';

export const SETTINGS = {
  Connections: {
    ethernet: true,
    wifi: true,
    gprs: false,
    currentType: 'wifi',
  },
  Battery: {
    present: true,
    level: 50,
    status: systemEnums.BatteryStatus.DISCHARGE,
  },
  PowerSupply: systemEnums.PowerSupply.USB,
  SerialNumber: '00000000',
};

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

function _getToneFrequency(tone, toneMap) {
  if (tone === toneMap.TONE1) return 1700;
  if (tone === toneMap.TONE2) return 1850;
  if (tone === toneMap.TONE3) return 2000;
  if (tone === toneMap.TONE4) return 2100;
  if (tone === toneMap.TONE5) return 2350;
  if (tone === toneMap.TONE6) return 2700;
  if (tone === toneMap.TONE7) return 2800;
  return null;
}

export function setup(System) {
  const localConfig = {
    TimeFromBoot: 0,
  };

  /**
   * Sets an interval that updates the {@link config.TimeFromBoot}
   * @returns {object} The interval object
   */
  setInterval(() => {
    localConfig.TimeFromBoot += 1000;
  }, 1000);

  /**
   * Returns on which network is connected
   * @memberOf System
   * @return {string} Wifi or 3G
   */
  System.getCurrentConnectionType = () =>
    State.get('System.Connections.currentType');

  /**
   * Checks if the device has ethernet
   * @memberOf System
   * @return {boolean} True if the device has ethernet
   */
  System.hasEthernet = () => State.get('System.Connections.ethernet');

  /**
   * Checks if the device has wifi
   * @memberOf System
   * @return {boolean} True if the device has wifi
   */
  System.hasWifi = () => State.get('System.Connections.wifi');

  /**
   * Checks if the device has gprs
   * @memberOf System
   * @return {boolean} True if the device has gprs
   */
  System.hasGprs = () => State.get('System.Connections.gprs');

  /**
   * Checks if the battery is present
   * @memberOf System
   * @return {boolean} True if the battery is present
   */
  System.isBatteryPresent = () => State.get('System.Battery.present');

  /**
   * Gets the decive current power supply
   * @memberOf System
   * @return {System.PowerSupply} The current power supply of the device
   */
  System.getPowerSupply = () => State.get('System.PowerSupply');

  /**
   * Gets the time from the boot until this moment [ms]
   * @memberOf System
   * @return {number} The time in milliseconds
   */
  System.getTimeFromBoot = () => localConfig.TimeFromBoot;

  /**
   * Gets the serial number of the device
   * @memberOf System
   * @return {string} The serial number
   */
  System.getSerialNumber = () => State.get('System.SerialNumber');

  /**
   * Gets the status of the battery
   * @memberOf System
   * @return {System.BatteryStatus} The status of the battery
   */
  System.getBatteryStatus = () => State.get('System.Battery.status');

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
  System.getBatteryLevel = () => State.get('System.Battery.level');

  /**
   * Performs a beep. Note that this function blocks the execution on the real device
   * until it's finished. If {@link tone} and {@link duration} are both undefined, the default beep
   * will be executed. If the {@link duration} is undefined, the default duration will be used
   * @memberOf System
   * @param  {System.Tone} tone         The tone of the beep
   * @param  {number}      [duration=300]     The duration of the tone in milliseconds
   */
  System.beep = (
    tone = System.Tones.TONE1,
    duration = DEFAULT_BEEP_DURATION,
  ) => {
    const toneFrequency = _getToneFrequency(tone, System.Tones);

    if (!toneFrequency) {
      if (__DEV__) error('Beep: Bad Usage');
      return;
    }

    if (__DEV__) log(`Beep: tone = ${tone}, duration = ${duration}`);

    if (!__TEST__ && typeof window.AudioContext !== 'undefined') {
      doBeep(duration, toneFrequency);
    }
  };
}
