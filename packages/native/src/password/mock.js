const MATCH_CODE = '123456'
const DEFAULT_PASSWORD = '1234'
const PASSWORD_LENGTH = 4

let adminPassword = DEFAULT_PASSWORD

// TODO: Refactor the return format to be { valid, msg }
// TODO: Move messages to app and make all methods return booleans
function matchesPassword(password, stonecode) {
  if (stonecode !== undefined) {
    return (
      (stonecode === '167988962' && password === '1111') ||
      (stonecode === '111111111' && password === '2222')
    )
  }

  return password === adminPassword
}

function validatePassword(password) {
  if (password.length !== PASSWORD_LENGTH) {
    return {
      valid: false,
      msg: 'A senha possui tamanho incorreto',
    }
  }

  return { valid: true }
}

function changePassword(oldPassword, password, confirmationPassword) {
  if (!matchesPassword(oldPassword)) {
    return {
      valid: false,
      msg: 'Senha antiga incorreta',
    }
  }

  if (password !== confirmationPassword) {
    return {
      valid: false,
      msg: 'Senha incorreta',
    }
  }

  if (validatePassword(confirmationPassword).valid) {
    adminPassword = password
  }
}

const getDefaultPassword = () => adminPassword
const getDefaultPasswordSize = () => getDefaultPassword().length
const generateRecoverPasswordCode = () => parseInt(Math.random() * 1e6)
const recoverPassword = (generatedCode, matchCode) => matchCode === MATCH_CODE
const verifyMatchCode = (generatedCode, matchCode) => matchCode === MATCH_CODE

export default function(Password) {
  Object.assign(Password, {
    matchesPassword,
    validatePassword,
    changePassword,
    recoverPassword,
    getDefaultPassword,
    generateRecoverPasswordCode,
    verifyMatchCode,
    getDefaultPasswordSize,
  })
}
