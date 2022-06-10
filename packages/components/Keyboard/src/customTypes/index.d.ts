import type SimpleKeyboard from '../components/Keyboard';

declare global {
  interface Window {
    SimpleKeyboardInstances: { [key: string]: SimpleKeyboard | null };
  }
}
