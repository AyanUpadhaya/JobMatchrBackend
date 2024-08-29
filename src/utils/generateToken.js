const jwt = require("jsonwebtoken");


// Utility function to generate JWT
const generateToken = (info) => {
  return jwt.sign({ ...info }, process.env.SECRET_KEY, {
    algorithm: "HS256",
    allowInsecureKeySizes: true,
    expiresIn: "30d",
  });
};

module.exports = generateToken;