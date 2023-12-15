const gettoken = require("../utils/generate_token_header");
const verify_token = require("../utils/verify_token");

const isLogin = (req, res, next) => {
  //get token from req header
  const token = gettoken(req);
  //verify
  const decodedUser = verify_token(token);
  //save the user into req obj
  req.user = decodedUser.id;
  if (!decodedUser) {
    return next(new Error("Invalid/Expired Token, Please login again", 401));
  }
  next();
};

module.exports = isLogin;
