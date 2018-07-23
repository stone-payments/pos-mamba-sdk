import Prism from 'prismjs'
import $ from 'cheerio'

const LINE_NUMBER = /\s*\bline-numbers\b\s*/

function lineNumber(env) {
  if (!env.code) {
    return
  }

  let $pre = env.$element.parent()

  if (
    !$pre ||
    !/pre/i.test($pre[0].tagName) ||
    // Abort only if nor the <pre> nor the <code> have the class
    (!LINE_NUMBER.test($pre.attr('class')) &&
      !LINE_NUMBER.test(env.$element.attr('class')))
  ) {
    return
  }

  if (env.$element.find('.line-numbers-rows').length !== 0) {
    return
  }

  if (env.$element.hasClass('line-numbers')) {
    env.$element.removeClass('line-numbers')
  } else if (!$pre.hasClass('line-numbers')) {
    env.$element.addClass('line-numbers')
  }

  let match = env.code.match(/\n(?!$)/g)
  let linesNum = match ? match.length + 1 : 1

  let $lineNumbersWrapper = $('<span>')
    .attr('aria-hidden', true)
    .addClass('line-numbers-rows')
  for (let i = 0; i < linesNum; i++) {
    $lineNumbersWrapper.append('<span>')
  }

  if ($pre.data('start')) {
    let start = parseInt($pre.data('start'), 10) - 1
    $pre.css('counter-reset', 'linenumber ' + start)
  }

  env.$element.append($lineNumbersWrapper)
}

Prism.hooks.add('complete', lineNumber)

export default lineNumber
