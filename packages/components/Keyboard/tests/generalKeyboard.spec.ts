/* eslint-disable no-empty-pattern */
import { expect, test } from '@playwright/test';
import { GeneralKeyboard } from '..';

// Test validation accordling the https://www.toptal.com/developers/keycode

test.describe('General Keyboard', () => {
  test('Get a table keyCode', ({}) => {
    expect(GeneralKeyboard.getTableKeyCode('0')).toBe(48);
    expect(GeneralKeyboard.getTableKeyCode('9')).toBe(57);
    expect(GeneralKeyboard.getTableKeyCode('8')).toBe(56);
    expect(GeneralKeyboard.getTableKeyCode('d')).toBe(68);
    expect(GeneralKeyboard.getTableKeyCode('/')).toBe(191);
  });

  test('Is Numeric Key', ({}) => {
    expect(GeneralKeyboard.isNumericKey(13)).toBe(false);
    expect(GeneralKeyboard.isNumericKey(49)).toBe(true);
  });

  test('Is Action Key', ({}) => {
    expect(GeneralKeyboard.isActionKey(13)).toBe(true);
    expect(GeneralKeyboard.isActionKey(49)).toBe(false);
  });

  test.describe('Backspace', () => {
    test.describe.configure({
      mode: 'serial',
    });

    test('Backspace enabled', ({}) => {
      GeneralKeyboard.enableBackspace();
      expect(GeneralKeyboard.isBackspaceEnabled()).toBe(true);
    });

    test('Backspace default', ({}) => {
      expect(GeneralKeyboard.isBackspaceEnabled()).toBe(true);
    });

    test('Backspace disabled', ({}) => {
      GeneralKeyboard.disableBackspace();
      expect(GeneralKeyboard.isBackspaceEnabled()).toBe(false);
    });
  });
});
