const responseObj = (success, message, payload, accessToken) => {
  return {
    success,
    message,
    payload,
    accessToken
  };
};

module.exports = { responseObj };