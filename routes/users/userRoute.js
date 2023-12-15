const express = require("express");
const User = require("../../models/user/User");
const userRoutes = express.Router();
const bcryptjs = require("bcryptjs");
const appErr = require("../../utils/appErr");
const protected = require("../../middlewares/protected");
const storage = require("../../config_db/cloudinary");
const multer = require("multer");
const gen_token = require("../../utils/generatetoken");
const verify_token = require("../../utils/verify_token");
const isLogin = require("../../middlewares/isLogin");

//multer helps to upload img
const upload = multer({ storage });
//register
userRoutes.post("/register", async (req, res, next) => {
  console.log(req.body);
  const { fullname, email, password } = req.body;
  if (!email || !password || !fullname) {
    console.log("YUP");
    return res.json({ message: "Please provide all details" });
  }
  try {
    //1-emial verify for already account
    const userFound = await User.findOne({ email });
    //check if fields are empty
    if (userFound) {
      return res.json({ status: "failed", data: "Already exist" });
    }
    //hash password
    const salt = await bcryptjs.genSalt(10);
    const haspass = await bcryptjs.hash(password, salt);
    //register user
    const user = await User.create({
      fullname,
      email,
      password: haspass,
    });
    res.json({
      status: "success",
      user: user,
    });
  } catch (err) {
    res.json(err);
  }
});
//Post login
// Post login
userRoutes.post("/login", async (req, res, next) => {
  console.log(req.body);
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ message: "Please provide all details" });
  }
  try {
    const userFound = await User.findOne({ email });
    console.log("password ", password, userFound.password);
    if (!userFound) return res.json({ message: "Invalid credential" });

    // Check password
    const isPasswordMatch = await bcryptjs.compare(
      password,
      userFound.password
    );
    if (!isPasswordMatch)
      return res.json({ message: "Invalid login Credentials" });

    res.json({
      status: "success",
      data: userFound,
      id: userFound._id,
      token: gen_token(userFound._id),
    });
  } catch (err) {
    next(new Error(err));
  }
});

//get logout
userRoutes.get("/Logout", async (req, res) => {
  try {
    res.json({
      status: "success",
      user: "logout",
    });
  } catch (err) {
    res.json(err);
  }
});
//get User profile
userRoutes.get("/profile/", isLogin, async (req, res, next) => {
  console.log(req.user);
  try {
    const user = await User.findById(req.user);
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});

//get user data
userRoutes.get("/:id", protected, async (req, res) => {
  try {
    console.log(req.params);
    //get id
    const userid = req.params.id;
    const user = await User.findById(userid);
    res.json({
      status: "success",
      data: user,
    });
  } catch (err) {
    res.json(err);
  }
});
//update profile img data
userRoutes.put(
  "/profile-upload/",
  protected,
  upload.single("Profile"),
  async (req, res) => {
    console.log(req.file.path);
    try {
      //1- find the user
      const userid = req.session.userAuth;
      const userFound = await User.findById(userid);
      //2-chck if user is found
      if (!userFound) {
        return res.json({
          status: "User not found",
        });
      }
      await User.findByIdAndUpdate(
        userid,
        {
          profileimg: req.file.path,
        },
        {
          new: true,
        }
      );
      res.json({
        status: "success",
        user: "Uploaded profile img",
      });
    } catch (err) {
      return next(new Error(err));
    }
  }
);
//update cover img data
userRoutes.put(
  "/cover-upload/",
  protected,
  upload.single("Profile"),
  async (req, res) => {
    try {
      //1- find the user
      const userid = req.session.userAuth;
      const userFound = await User.findById(userid);
      //2-chck if user is found
      if (!userFound) {
        return res.json({
          status: "User not found",
        });
      }
      await User.findByIdAndUpdate(
        userid,
        {
          coverimg: req.file.path,
        },
        {
          new: true,
        }
      );
      res.json({
        status: "success",
        user: "Cover updated profile img",
      });
    } catch (err) {
      return next(new Error(err));
    }
  }
);
//update password data
userRoutes.put("/user-password/:id", async (req, res) => {
  const { password } = req.body;
  try {
    if (password) {
      const salt = await bcryptjs.genSalt(10);
      const passhash = await bcryptjs.hash(password, salt);
      await User.findByIdAndUpdate(
        req.params.id,
        {
          password: passhash,
        },
        {
          new: true,
        }
      );
      res.json({
        status: "success",
        user: "password-updated",
      });
    }
  } catch (err) {
    next(new Error(err));
  }
});
//update user data
userRoutes.put("/:id", async (req, res) => {
  const { fullname, email } = req.body;
  try {
    if (email) {
      const emailTaken = await User.findOne({ email });
      if (emailTaken) {
        return next(new Error("email already taken"));
      }
    }
    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullname,
        email,
      },
      {
        new: true,
      }
    );
    res.json({
      status: "success",
      data: user,
    });
  } catch (err) {
    next(new Error(err));
  }
});
module.exports = userRoutes;
