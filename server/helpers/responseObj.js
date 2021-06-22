const responseObj = (success, message, payload, accessToken, refreshToken) => {
  return {
    success,
    message,
    payload,
    accessToken,
    refreshToken
  };
};

module.exports = { responseObj };