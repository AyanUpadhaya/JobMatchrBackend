const bcrypt = require("bcryptjs");

const hashPassowrd = (password, salt = 10) => {
  return bcrypt.hashSync(password, salt);
};

const comparePassword = (password, userPassword) => {
  return bcrypt.compareSync(password, userPassword);
};

module.exports = {
  hashPassowrd,
  comparePassword,
};
