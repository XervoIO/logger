function isException (data) {
  return data.message && data.message.indexOf('uncaughtException') === 0
}

function isProduction () {
  return process.env.NODE_ENV === 'production'
}

module.exports = function (namespace, data) {
  var out = [
    data.timestamp(),
    data.level.toUpperCase(),
    namespace
  ]

  if (data.message) out.push(data.message)

  if (data.meta && Object.keys(data.meta).length) {
    out.push(JSON.stringify(data.meta))
  }

  if (isException(data) && !isProduction()) {
    out.push('\n')
    out.push(data.meta.stack.join('\n'))
  }

  return out.join(' ')
}
