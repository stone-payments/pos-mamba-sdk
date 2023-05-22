import { resolve } from 'path';

export default (...paths: string[]): string => resolve(process.cwd(), ...paths);
