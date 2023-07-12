/// <reference types="mini-html-webpack-plugin/dist/index.d.ts" />
import pico from 'picocolors';
import { generateCSSReferences, generateJSReferences } from 'mini-html-webpack-plugin';
import { minify as htmlMinify } from 'html-minifier';
import { getPackage } from '@mamba/utils';

import {
  IS_BROWSER,
  IS_DEV,
  IS_PROD,
  IS_POS,
  IS_WATCHING,
  WEINRE_IP,
  HTML_BASE_URL,
  REMOTEJS,
} from '@mamba/configs/envModes.cjs';

const PKG = getPackage();

function getLazyApp(src: string) {
  return `
    <button id="loadbtn" style="font-size: 20px; position: absolute; top: 50%; left: 50%; -webkit-transform: translateX(-50%);">LOAD</button>
    <script>
      var btn = document.getElementById("loadbtn");
      btn.onclick = function injectApp() {
        setTimeout(function () {
          var newScript = document.createElement('script');
          newScript.src = './${src}';
          document.body.appendChild(newScript);
          try {
            btn.parentNode.removeChild(btn);
        }
        catch (e) {
            console.log(e);
        }
        }, 100);
      }
    </script>
  `;
}

type Attributes = Record<string, unknown>;

type Context = {
  title?: string;
  htmlAttributes?: Attributes;
  cssAttributes?: Attributes;
  jsAttributes?: Attributes;
};

type TemplateParameters = {
  css?: string[];
  js?: string[];
  body?: string;
  head?: string;
  publicPath: string;
} & Context;

export default function getHTMLTemplate({
  css = [],
  js = [],
  publicPath = '',
  title = '',
  cssAttributes = {},
  jsAttributes = {},
}: TemplateParameters) {
  const cssTags = generateCSSReferences({
    files: css,
    attributes: cssAttributes,
    publicPath,
  });

  const jsTags = generateJSReferences({
    files: js,
    attributes: jsAttributes,
    publicPath,
  });

  let lazyApp = '';

  // Usefull to catch errors on launch
  if (IS_DEV && !IS_WATCHING()) {
    const app = js.pop();
    try {
      lazyApp = getLazyApp(String(app));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(e);
    }
  }

  let weinre: string | boolean = false;
  let baseUrl: string | undefined;

  if (WEINRE_IP) {
    // const ip = String(WEINRE_IP).trim();
    const ipRegEx = /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/gm;
    const isValidIp = ipRegEx.test(WEINRE_IP);
    if (!isValidIp) {
      pico.yellow(`\n\n ⚠️ Invalid IP ${WEINRE_IP} for WEINRE_IP environment variable!`);
    }

    if (isValidIp) {
      weinre = `<script src="http://${WEINRE_IP}:9000/target/target-script-min.js#anonymous"></script>`;

      // eslint-disable-next-line no-console
      process.on('exit', () =>
        console.log(
          pico.cyan('\n\n Weinre(WEb INspector REmote) is enabled. \n To start server, run: '),
          pico.yellow(
            'weinre --boundHost=-all- --httpPort=9000 --readTimeout=8 --deathTimeout=60 \n\n',
          ),
        ),
      );
    }
  }

  let font: string | boolean = false;
  if (IS_BROWSER && IS_WATCHING() && IS_DEV) {
    font =
      '<link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500&display=swap" rel="stylesheet">';
  }

  let remotejs: string | undefined;
  if (REMOTEJS) {
    remotejs = `<script data-consolejs-channel="${REMOTEJS}" src="https://remotejs.com/agent/agent.js"></script>`;
  }

  if (HTML_BASE_URL) {
    baseUrl = `<base href="${HTML_BASE_URL}">`;
  }

  const htmlTemplate = `<!DOCTYPE html>
  <html>
    <head>
      ${baseUrl || ''}
      <meta charset="UTF-8">
      <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0"/>
      ${IS_BROWSER ? '<meta name="mobile-web-app-capable" content="yes">' : ''}
      <title>${title}</title>
      ${cssTags}
      ${font || ''}
      ${
        !IS_POS && typeof PKG.mamba === 'object' && typeof PKG.mamba.iconPath === 'string'
          ? `<link rel="shortcut icon" href="${PKG.mamba.iconPath}" type="image/x-icon">`
          : ''
      }
    </head>
    <body id="app-root">
      ${jsTags}
      ${weinre || ''}
      ${lazyApp}
      ${remotejs || ''}
    </body>
  </html>`;

  return String(
    IS_PROD
      ? htmlMinify(htmlTemplate, {
          collapseWhitespace: true,
          conservativeCollapse: true,
          minifyCSS: true,
          minifyJS: true,
          keepClosingSlash: true,
          preserveLineBreaks: false,
          removeComments: true,
        })
      : htmlTemplate,
  );
}
