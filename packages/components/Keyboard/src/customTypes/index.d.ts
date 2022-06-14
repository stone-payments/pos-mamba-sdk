import type MambaKeyboard from '../components/Keyboard';

declare global {
  interface Window {
    MambaKeyboardInstance: { [key: string]: MambaKeyboard | null };
  }
}
