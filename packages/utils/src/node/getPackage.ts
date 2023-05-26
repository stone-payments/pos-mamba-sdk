import { resolve, dirname } from 'node:path';
import { existsSync, readFileSync } from 'node:fs';
import { type PackagePrediction } from './types';

const cache = new Map();

/**
 * Retrieve working directore package.json
 * @returns
 */
export default function getPackage({ path = process.cwd() } = {}): PackagePrediction | null {
  if (cache.has(path)) return cache.get(path);

  const pkgPath = resolve(path, 'package.json');

  if (!existsSync(pkgPath)) {
    return null;
  }

  const data: PackagePrediction = JSON.parse(readFileSync(pkgPath, 'utf8'));
  data.rootDir = dirname(pkgPath);
  cache.set(path, data);
  return data;
}
