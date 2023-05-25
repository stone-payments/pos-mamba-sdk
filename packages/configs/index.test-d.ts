import { expectType } from 'tsd';
import env from './envModes.cjs';

expectType<string>(env.IS_STORYBOOK);
expectType<string>(env.NODE_ENV);
expectType<string>(env.APP_ENV);
expectType<string>(env.WEINRE_IP);
expectType<string>(env.SDK_ASSETS_FOLDER);
expectType<string>(env.ORG_ASSETS_FOLDER);
expectType<string>(env.HTML_BASE_URL);
expectType<boolean>(env.IS_PROD);
expectType<boolean>(env.IS_DEV);
expectType<string>(env.DEBUG_LVL);
expectType<boolean>(env.IS_BROWSER);
expectType<boolean>(env.IS_POS);
expectType<string>(env.BUNDLE_NAME);
expectType<boolean>(env.ADD_MAMBA_SIMULATOR);
expectType<boolean>(env.IS_WATCHING());
expectType<boolean>(env.IS_TEST());
