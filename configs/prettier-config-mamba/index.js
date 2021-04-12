/**
 * Copyright 2021 Stone Co.
 *
 * Licensed under Apache License - Version 2.0
 * http://www.apache.org/licenses/
 *
 */

'use strict';

const lineLength = 100;

exports.lineLength = lineLength;

module.exports = {
  // Native prettier options
  jsxBracketSameLine: true,
  printWidth: lineLength,
  bracketSpacing: true,
  singleQuote: true,
  trailingComma: 'all',
  proseWrap: 'always',
  semi: true,

  /* Svelte options */

  /* Sort order for scripts, markup, and styles */
  svelteSortOrder: 'options-markup-scripts-styles',

  /* More strict HTML syntax: self-closed tags, quotes in attributes */
  svelteStrictMode: true,

  /* Put the `>` of a multiline element on a new line */
  svelteBracketNewLine: true,

  /* 'Option to enable/disable component attribute shorthand if attribute name and expressions are same', */
  svelteAllowShorthand: true,

  /* 'Whether or not to indent the code inside <script> and <style> tags in Svelte files', */
  svelteIndentScriptAndStyle: true,
};
