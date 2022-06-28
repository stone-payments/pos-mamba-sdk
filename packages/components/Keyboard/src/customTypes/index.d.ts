import type MambaKeyboard from '../components/Keyboard';

declare global {
  interface Window {
    MambaKeyboardInstance: { [key: string]: MambaKeyboard | null };
  }

  const __DEV__: boolean;
  const __DEBUG_LVL__: number;
  const __SIMULATOR__: boolean;
}
