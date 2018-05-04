export default function(from, to, callback) {
  if (from instanceof Date && to instanceof Date) {
    return true
  } else {
    let error = new Error(
      "BAD USAGE: The 'from' and 'to' parameters must be an instance of Date",
    )
    console.error(error)
    if (typeof callback === 'function') {
      callback.call(this, [], error)
    }
  }
  return false
}
