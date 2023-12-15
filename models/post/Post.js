const mongoose = require("mongoose");
const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      require: true,
    },
    desc: {
      type: String,
      required: true,
    },
    category: {
      type: String,
    },
    img: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Post = mongoose.model("Post", postSchema);
module.exports = Post;
