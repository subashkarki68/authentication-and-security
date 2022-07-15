//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const app = express();
const port = 3000;

//Connecting to monfgoDB
const URI =
  "mongodb+srv://subashkarki68:lpGPJ9WHOzBsULZ2@cluster0.c3sr77b.mongodb.net/";
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

// var secret = process.env.SOME_LONG_UNGUESSABLE_STRING;
var secret = "secret";
userSchema.plugin(encrypt, { secret: secret, encryptedFields: ["password"] });

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
  const newUser = new User({
    email: req.body.email,
    password: req.body.password,
  });
  newUser.save(function (err, result) {
    if (err) {
      console.log(err);
    } else {
      res.render("secrets");
    }
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
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    }
  );
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
