export default function (System) {
  /**
   * Definition of the possible tones. TONE1 has the lowest frequency, while TONE7 has the highest one
   * @memberOf System
   * @name Tone
   * @type {object}
   * @property {string} TONE1
   * @property {string} TONE2
   * @property {string} TONE3
   * @property {string} TONE4
   * @property {string} TONE5
   * @property {string} TONE6
   * @property {string} TONE7
   */
  System.Tone = Object.freeze({
    TONE1: 'TONE1',
    TONE2: 'TONE2',
    TONE3: 'TONE3',
    TONE4: 'TONE4',
    TONE5: 'TONE5',
    TONE6: 'TONE6',
    TONE7: 'TONE7',
  })

  /**
   * Definition of the possible power supplies
   * @memberOf System
   * @name PowerSupply
   * @type {object}
   * @property {string} ADAPTER Powered by the adapter
   * @property {string} BATTERY Powered by the battery
   * @property {string} USB     Powered by the USB
   */
  System.PowerSupply = Object.freeze({
    ADAPTER: 'ADAPTER',
    BATTERY: 'BATTERY',
    USB: 'USB',
  })

  /**
   * Definition of the possible battery status
   * @memberOf System
   * @name BatteryStatus
   * @type {object}
   * @property {string} CHECK_NOT_SUPPORTED   The battery check is not supported on the device
   * @property {string} IN_CHARGE             The battery is charging
   * @property {string} CHARGE_COMPLETE       The battery is completely charged
   * @property {string} DISCHARGE             The battery is discharging
   * @property {string} ABSENT                The battery is absent
   */
  System.BatteryStatus = Object.freeze({
    CHECK_NOT_SUPPORTED: 'CHECK_NOT_SUPPORTED',
    IN_CHARGE: 'IN_CHARGE',
    CHARGE_COMPLETE: 'CHARGE_COMPLETE',
    DISCHARGE: 'DISCHARGE',
    ABSENT: 'ABSENT',
  })
}
