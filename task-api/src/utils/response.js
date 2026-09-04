function success({ data = null, meta = null, message = 'OK' } = {}) {
  return {
    success: true,
    message,
    data,
    meta,
    error: null
  };
}

function failure({ code, message, details = null, meta = null } = {}) {
  return {
    success: false,
    message,
    data: null,
    meta,
    error: {
      code,
      details
    }
  };
}

module.exports = {
  success,
  failure
};
