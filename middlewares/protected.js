const appErr = require("../utils/appErr");

const protected = (req, res, next) => {
  if (req.session.userAuth) {
    next();
  } else {
    return res.status(401).json({
      status: "Please login again",
    });
  }
};
module.exports = protected;
