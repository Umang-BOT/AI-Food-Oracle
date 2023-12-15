const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  profileimg: {
    type: String,
  },
  coverimg: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Post",
    },
  ],
  comments: [
    {
      type: mongoose.Types.ObjectId,
      ref: "Comment",
    },
  ],
});
const User = mongoose.model("User", userSchema);
module.exports = User;
