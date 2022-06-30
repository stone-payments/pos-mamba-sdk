import Keyboard from './components/Keyboard';
import PhysicalKeyboard from './controllers/PhysicalKeyboard';
import GeneralKeyboard from './controllers/GeneralKeyboard';
import * as KEYBOARD from './mappings';

export * from './types';

export { KEYBOARD, GeneralKeyboard, PhysicalKeyboard };
export default Keyboard;
