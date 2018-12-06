import { existsSync } from 'fs';
import { resolve } from 'path';
import copy from 'rollup-plugin-copy';

import { fromSrc } from './paths.js';

/** rollup-plugin-copy wrapper */
export default (staticArtifacts, distPath) =>
  copy({
    verbose: true,
    ...staticArtifacts.reduce((acc, artifactPath) => {
      const srcPath = fromSrc(artifactPath);
      if (existsSync(srcPath)) {
        acc[fromSrc(artifactPath)] = resolve(distPath, artifactPath);
      }
      return acc;
    }, {}),
  });
