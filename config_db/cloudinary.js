require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { model } = require("mongoose");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
//congfigure
cloudinary.config({
  cloud_name: process.env.Cloud_Name,
  api_key: process.env.Cloud_Key,
  api_secret: process.env.Cloud_Secret_Key,
});
//storage
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "jpeg", "png"],
  params: {
    folder: "blog-app",
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

module.exports = storage;
