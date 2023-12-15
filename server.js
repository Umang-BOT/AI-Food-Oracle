const express = require("express");
const userRoutes = require("./routes/users/userRoute");
const postRoute = require("./routes/posts/postRoute");
const err_han = require("./middlewares/err_han");
const Mongostore = require("connect-mongo");
const app = express();
require("dotenv").config();
const cors = require("cors");
const path = require("path");

require("./config_db/dbconnect");
//cors middleware
app.use(cors());
app.use(express.json());
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/posts", postRoute);
app.use(express.static(path.join(__dirname, "./Frontend/blog_front/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./Frontend/blog_front/build/index.html"));
});
//Error handler
app.use(err_han);

//listen port
const port = process.env.PORT || 5000;
app.listen(port, console.log(`server is running on port ${port}`));
