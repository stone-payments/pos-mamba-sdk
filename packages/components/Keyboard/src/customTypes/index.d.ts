import type MambaKeyboard from '../components/Keyboard';

declare global {
  interface Window {
    MambaKeyboardInstance: { [key: string]: MambaKeyboard | null };

    $System: {
      beep: (beepFrequence: string, beepTime: number) => void;
    };

    Sound?: {
      isEnabled: () => boolean;
    };
  }

  const __DEV__: boolean;
  const __DEBUG_LVL__: number;
  const __SIMULATOR__: boolean;
}
