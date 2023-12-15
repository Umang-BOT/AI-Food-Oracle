const jwt = require("jsonwebtoken");
const gen_token = (id) => {
  return jwt.sign({ id }, "anykey", { expiresIn: "1d" });
};
module.exports = gen_token;
