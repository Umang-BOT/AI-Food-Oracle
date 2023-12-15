const express = require("express");
const postRoute = express.Router();
const protected = require("../../middlewares/protected");
const User = require("../../models/user/User");
const Post = require("../../models/post/Post");
const storage = require("../../config_db/cloudinary");
const multer = require("multer");
const isLogin = require("../../middlewares/isLogin");
//instance of multer
const upload = multer({
  storage,
});
//post Route
postRoute.post("/", isLogin, upload.single("file"), async (req, res, next) => {
  console.log("reqqqqqqqqq ", req.user);
  const { title, desc, category, img, user } = req.body;
  try {
    if (!title || !desc || !req.file) {
      return res.json({
        status: "please provide all details",
      });
    }

    const userFound = await User.findById(req.user);
    const postCreated = await Post.create({
      title,
      desc,
      category,
      img: req.file.path,
      user: userFound._id,
    });
    //push the post
    userFound.posts.push(postCreated._id);
    //save the changes
    await userFound.save();
    res.json({
      status: "success",
      user: "Post created",
    });
  } catch (err) {
    res.json(err);
  }
});
//get all Posts
postRoute.get("/", async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.json({
      status: "success",
      user: posts,
    });
  } catch (err) {
    next(new Error(err));
  }
});
//get single id
postRoute.get("/:id", async (req, res, next) => {
  try {
    //get id from params
    const userid = req.params.id;
    //find the post
    const post = await Post.findById(userid);
    res.json({
      status: "success",
      data: post,
    });
  } catch (err) {
    next(new Error(err));
  }
});
//delete post
postRoute.delete("/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    console.log(req.params.id);
    if (!post) {
      return res.status(404).json({
        status: "fail",
        message: "Post not found",
      });
    }
    const deletePost = await Post.findByIdAndDelete(req.params.id, {
      writeConcern: { w: "majority" },
    });

    console.log(post);
    res.json({
      status: "success",
      message: "Post deleted",
    });
    deletePost.save();
  } catch (err) {
    next(new Error(err));
  }
});

//update
postRoute.put("/:id", upload.single("file"), async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.user.toString() !== req.session.userAuth.toString()) {
      return next(new Error("Yor are not allowed"));
    }
    const updatePost = Post.findByIdAndUpdate(req.params.id, {
      title,
      desc,
      category,
      img: req.file.path,
    });
    res.json(
      {
        status: "success",
        user: "post updated",
      },
      {
        new: true,
      }
    );
  } catch (err) {
    res.json(err);
  }
});
module.exports = postRoute;
