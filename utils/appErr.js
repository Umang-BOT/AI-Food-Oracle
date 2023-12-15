const appErr = (message, statusCode) => {
  let error = new Error(message);
  error.stack = err.stack;
  error.statusCode = statusCode ? statusCode : 500;
  return error;
};
module.exports = appErr;
