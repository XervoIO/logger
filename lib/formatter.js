const OS = require('os')

// get formatted log string from data
const formatter = (namespace) => (data) => {
  const out = [
    new Date().toISOString(),
    data.level.toUpperCase(),
    namespace
  ]

  if (data.message) out.push(data.message)
  if (hasMeta(data)) out.push(formatMeta(data))

  return out.join(' ')
}

const hasMeta = (data) => {
  return data.meta && Object.keys(data.meta).length
}

const formatMeta = (data) => {
  if (!isException(data)) return JSON.stringify(data.meta)
  return `${OS.EOL}${data.meta.stack.join(OS.EOL)}`
}

const isException = (data) => {
  return data.message && data.message.indexOf('uncaughtException') === 0
}

module.exports = formatter
