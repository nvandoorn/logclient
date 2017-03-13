
exports.isUndefined = (property) => {
  return typeof property === 'undefined';
};

exports.isNumber = (number) => {
  return typeof number === 'number';
};

exports.buildRes = (success, msg, data) => ({
  success: success,
  msg: msg,
  data: data
});

