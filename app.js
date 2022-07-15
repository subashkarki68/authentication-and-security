//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();
const port = process.env.PORT || 3000;

//Connecting to monfgoDB
const URI = process.env.MONGOOSE_URI;
const dbName = "secretsDB";

mongoose.connect(URI + dbName, function (err) {
  if (!err) {
    console.log("Successfully connected to " + dbName + " database.");
  } else {
    console.log(err);
  }
});

//Creating Schemas

const { Schema } = mongoose;
const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  }, // username is required
  password: {
    type: String,
    required: true,
  }, // password is required
});

const User = mongoose.model("User", userSchema);

app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
  express.static("public")
);

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    // Store hash in your password DB.
    const newUser = new User({
      email: req.body.email,
      password: hash,
    });
    newUser.save(function (err, result) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  User.findOne(
    {
      email: email,
    },
    (err, foundUser) => {
      if (err) {
        console.log(err);
      } else {
        // Load hash from your password DB.
        bcrypt.compare(password, foundUser.password, function (err, result) {
          if (result) {
            res.render("secrets");
          } else {
            res.send("password do not match");
          }
        });
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
