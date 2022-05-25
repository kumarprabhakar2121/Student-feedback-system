require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const cloudinary = require("./config/cloudinary");
let cors = require("cors");
const logger = require("morgan");

const app = express();
app.use(logger("dev"));
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());
app.options("*", cors());
var storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/form", (req, res) => {
  res.render("form");
});

const userRoute = require("./route/userRoute");
const studentDetailsRoute = require("./route/studentDetailsRoute");
const userRoleRoute = require("./route/userRoleRoute");
const reviewRoute = require("./route/reviewRoute");

app.use("/user", userRoute);
app.use("/student", studentDetailsRoute);
app.use("/userRole", userRoleRoute);
app.use("/review", reviewRoute);

module.exports = app;
