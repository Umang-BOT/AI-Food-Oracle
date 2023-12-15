const mongoose = require("mongoose");
require("dotenv").config();
const dbconnect = async () => {
  try {
    await mongoose.connect(process.env.Mongo_URL);
    console.log("DB connected successfully");
  } catch (error) {
    return console.log("failed");
  }
};

dbconnect();
