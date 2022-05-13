const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require("config");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const _ = require("lodash");
const bcrypt = require("bcrypt");

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

router.post("/", async (req, res) => {
  // if (User.collection.getIndex("email_1")) User.collection.dropIndex("email_1"); //Drop the Unique index:
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let user1 = await User.findOne({ email: req.body.email });
  let user2 = await User.findOne({ phone: req.body.phone });
  if (user1 || user2) return res.status(400).send("User already registered");

  user = new User(
    //   {
    //   name: req.body.name,
    //   email: req.body.email,
    //   password: req.body.password,
    // }
    _.pick(req.body, ["name", "email", "password", "phone"])
  );
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();
  // const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
  const token = user.generateAuthToken();

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email", "phone"]));
});

module.exports = router;
