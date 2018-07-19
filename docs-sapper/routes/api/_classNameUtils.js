const LANG = /\blang(?:uage)?-(\w+)\b/i
const SPACE = /\s+/g

exports.notIncludeLanguage = function notIncludeLanguage(className) {
  if (typeof className !== 'string') {
    return true
  } else {
    return !LANG.test(className)
  }
}

exports.getLanguageFromClassName = function getLanguageFromClassName(
  className,
) {
  if (typeof className !== 'string') {
    return ''
  }
  return (className.match(LANG) || [''])[1].toLowerCase()
}

exports.addLanguageIfNotPresent = function addLanguageIfNotPresent(
  className,
  language,
) {
  if (typeof className !== 'string') {
    className = ''
  }
  return (
    className.replace(LANG, '').replace(SPACE, ' ') + ' language-' + language
  )
}
