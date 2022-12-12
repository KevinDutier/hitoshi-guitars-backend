const express = require("express");
const router = express.Router();
const uid2 = require("uid2");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const { checkFieldsRequest } = require("../modules/checkFieldsRequire");
const { testUsername } = require("../modules/usernameValidityCheck");
const { testPassword } = require("../modules/passwordValidityCheck");

// NOTE: for testing:
// username: chiri      password: Abc123

// http://localhost:3000/users/
router.get("/", (req, res) => {
  res.send("users index");
});

// get all users
router.get("/all", async (req, res) => {
  const allUsers = await User.find();

  res.json({
    allUsers,
  });
});

// signup
// checks (in this order):
// -no empty fields
// -valid username
// -username not taken
// -valid password
router.post("/signup", async (req, res) => {
  if (!checkFieldsRequest(req.body, ["username", "password"])) {
    // checks for empty fields
    res.json({
      result: false,
      msg: "missing or empty fields",
    });
    return;
  }

  if (!testUsername(req.body.username)) {
    // checks that username is valid
    res.json({
      result: false,
      msg: `invalid username: cannot contain special characters and must be 5 to 16 characters-long`,
    });
  } else {
    // username valid (no special characters and 5-16 characters-long)

    // checks whether username is already taken
    const usernameTakenCheck = await User.findOne({
      usernameFormatted: req.body.username.toLowerCase(),
    });

    if (usernameTakenCheck) {
      // username is taken
      res.json({
        result: false,
        msg: `username already taken`,
      });
    } else {
      // username not taken

      if (!testPassword(req.body.password)) {
        // invalid password
        res.json({
          result: false,
          msg: `invalid password: must be 6 to 20 characters-long and contain at least one lower case, one upper case, one digit, and no white spaces`,
        });
      } else {
        // valid password, save user to database
        const hash = bcrypt.hashSync(req.body.password, 10);
        const token = uid2(32);

        const newUser = new User({
          username: req.body.username,
          usernameFormatted: req.body.username.toLowerCase(),
          password: hash,
          token: token,
        });
        newUser.save().then(
          res.json({
            result: true,
            msg: `user ${req.body.username} saved`,
            // we send the username and token back so they can be used by the frontend
            username: req.body.username,
            token,
          })
        );
      }
    }
  }
});

// signin
// checks (in this order):
// -no empty fields
// -user exists
// -password is correct
router.post("/signin", async (req, res) => {
  if (!checkFieldsRequest(req.body, ["username", "password"])) {
    // checks for empty fields
    res.json({
      result: false,
      msg: "missing or empty fields",
    });
    return;
  }

  const findUser = await User.findOne({
    usernameFormatted: req.body.username.toLowerCase(),
  });

  if (!findUser) {
    // username not found
    res.json({
      result: false,
      msg: `user not found`,
    });
    return;
  }

  if (!bcrypt.compareSync(req.body.password, findUser.password)) {
    // username found, but password is incorrect
    res.json({
      result: false,
      msg: `incorrect password`,
    });
  } else {
    // username found and password is correct
    res.json({
      result: true,
      msg: `user ${req.body.username} signed in`,
      username: findUser.username,
      token: findUser.token,
    });
  }
});

// delete user
router.delete("/delete", async (req, res) => {
  const deleteUser = await User.deleteOne({
    usernameFormatted: req.body.username.toLowerCase(),
  });

  if (deleteUser.deletedCount === 0) {
    res.json({
      result: false,
      msg: `user not found`,
    });
  } else {
    res.json({
      result: true,
      msg: `user ${req.body.username} deleted`,
    });
  }
});

module.exports = router;
