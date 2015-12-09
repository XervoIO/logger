module.exports = function (namespace, data) {
  var out = [
    data.timestamp(),
    data.level.toUpperCase(),
    namespace
  ];

  if (data.message) out.push(data.message);
  if (data.meta && Object.keys(data.meta).length) {
    out.push(JSON.stringify(data.meta));
  }

  return out.join(' ');
}
