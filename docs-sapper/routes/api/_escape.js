const LT = /&lt;/g
const GT = /&gt;/g
const AMP = /&amp;/g
const CRLFcode = /\r?\n\s*<code/
const codeCRLF = /<\/code>\s*\r?\n\s*/

exports.tag = function tag(str) {
  if (typeof str !== 'string') {
    return str
  }
  return str.replace(LT, '<').replace(GT, '>')
}

exports.amp = function amp(str) {
  if (typeof str !== 'string') {
    return str
  }
  return str.replace(AMP, '&')
}

exports.removePreCodeCRLF = function(input) {
  return input.replace(CRLFcode, '<code')
}

exports.removeCodePreCRLF = function(input) {
  return input.replace(codeCRLF, '</code>')
}
