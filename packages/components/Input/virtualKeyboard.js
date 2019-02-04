const KEYBOARD_LAYOUTS = {
  default: {
    firstRowKeys: ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    secondRowKeys: ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    thirdRowKeys: ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
    utilityKeys: ['@', '.'],
  },
  capitalized: {
    firstRowKeys: ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    secondRowKeys: ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    thirdRowKeys: ['Z', 'X', 'C', 'V', 'B', 'N', 'M'],
    utilityKeys: ['@', '.'],
  },
  special: {
    firstRowKeys: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    secondRowKeys: [':', '/', '-', '_', '*', '#', '?', '!', '('],
    thirdRowKeys: [')', '$', '%', '[', ']', '+', '='],
    utilityKeys: ['@', ','],
  },
};

const DEFAULT_SUGGESTIONS = [
  {
    target: 'a',
    suggestions: ['ã', 'á', 'à', 'â'],
  },
  {
    target: 'e',
    suggestions: ['ẽ', 'é', 'è', 'ê'],
  },
  {
    target: 'i',
    suggestions: ['ĩ', 'í', 'ì', 'î'],
  },
  {
    target: 'o',
    suggestions: ['õ', 'ò', 'ó', 'ô'],
  },
  {
    target: 'u',
    suggestions: ['ũ', 'ú', 'ù', 'û'],
  },
  {
    target: 'c',
    suggestions: ['ç', 'ça', 'ço', 'ção'],
  },
  {
    target: 'A',
    suggestions: ['Ã', 'Á', 'À', 'Â'],
  },
  {
    target: 'E',
    suggestions: ['Ẽ', 'É', 'È', 'Ê'],
  },
  {
    target: 'I',
    suggestions: ['Ĩ', 'Í', 'Ì', 'Î'],
  },
  {
    target: 'O',
    suggestions: ['Õ', 'Ò', 'Ó', 'Ô'],
  },
  {
    target: 'U',
    suggestions: ['Ũ', 'Ú', 'Ù', 'Û'],
  },
  {
    target: 'C',
    suggestions: ['Ç', 'ÇA', 'ÇO', 'ÇÃO'],
  },
];

export default { KEYBOARD_LAYOUTS, DEFAULT_SUGGESTIONS };
