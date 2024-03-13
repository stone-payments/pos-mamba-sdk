export const DefaultOrganizations = Object.freeze({
  STONE: 'stone',
  TON: 'ton',
  WLPAGARME: 'wlpagarme',
});

export const SystemOrganizationsDefault = {
  enumerator: DefaultOrganizations,
  current: DefaultOrganizations.STONE,
  // External is the organization module data
  external: undefined,
};

export default {
  Tones: Object.freeze({
    TONE1: 'TONE1',
    TONE2: 'TONE2',
    TONE3: 'TONE3',
    TONE4: 'TONE4',
    TONE5: 'TONE5',
    TONE6: 'TONE6',
    TONE7: 'TONE7',
  }),
  PowerSupply: Object.freeze({
    ADAPTER: 'ADAPTER',
    BATTERY: 'BATTERY',
    USB: 'USB',
  }),
  BatteryStatus: Object.freeze({
    CHECK_NOT_SUPPORTED: 'CHECK_NOT_SUPPORTED',
    IN_CHARGE: 'IN_CHARGE',
    CHARGE_COMPLETE: 'CHARGE_COMPLETE',
    DISCHARGE: 'DISCHARGE',
    ABSENT: 'ABSENT',
  }),
  DefaultOrganizations,
  Organizations: {
    ...DefaultOrganizations,
  },
  SystemOrganizationsDefault,
};
