/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { IS_BROWSER } from '../../configs/envModes.cjs';
import fromWorkingDir from './fromWorkingDir';

const VIRTUAL_FILES = [`./index.${IS_BROWSER ? 'browser' : 'pos'}.ts`];
const getVirtualFiles = (): any =>
  VIRTUAL_FILES.reduce((acc, filepath) => {
    if (!existsSync(fromWorkingDir('src', filepath))) {
      acc[filepath] = readFileSync(resolve(__dirname, '..', 'virtual-files', filepath));
    }
    return acc;
  }, {});

export default getVirtualFiles;
