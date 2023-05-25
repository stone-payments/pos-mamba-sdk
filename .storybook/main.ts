import type { StorybookConfig } from '@storybook/svelte-webpack5';
import wpAppConfig from '../packages/webpack/config.common';
import preprocess from 'svelte-preprocess';

process.env.STORYBOOK = JSON.stringify(true);

const config: StorybookConfig = {
  stories: [
    './pages/*.mdx',
    '../packages/jade*/**/*.mdx',
    '../packages/jade*/**/*.stories.@(js|ts|svelte)',
  ],
  addons: [
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  core: {
    builder: '@storybook/builder-webpack5',
  },
  framework: {
    name: '@storybook/svelte-webpack5',
    options: {
      preprocess: preprocess({
        postcss: true,
        defaults: {
          script: 'typescript',
          style: 'postcss',
        },
        typescript: {
          compilerOptions: {
            target: 'es2018',
          },
        },
        babel: {
          // presets: ['@babel/preset-env', '@babel/preset-typescript'],
          plugins: [
            '@babel/plugin-proposal-optional-chaining',
            '@babel/plugin-proposal-nullish-coalescing-operator',
          ],
        },
      }),
    },
  },
  webpackFinal: async (config) => {
    const configMerged = {
      ...config,
      module: {
        rules: [...config.module!.rules!, ...wpAppConfig.module!.rules!],
        ...config.module,
      },
    };
    return configMerged;
  },
  docs: {
    autodocs: 'tag',
  },
};

export default config;
