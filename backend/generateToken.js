const jwt = require("jsonwebtoken");

const generateTokens = (id) => {
  const accessToken = jwt.sign({ id }, process.env.ACCESS_SECRET, {
    expiresIn: "1m",
  });
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

module.exports = generateTokens;
