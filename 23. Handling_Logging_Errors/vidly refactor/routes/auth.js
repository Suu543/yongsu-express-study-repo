const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.eamil });
  // 사용자에게 비밀번호와 이메일 중 어떤 것이 잘못되었는지 알려주는 것은 좋지 않기 때문에 가능한 일반화된 오류 메시지를 출력해줍니다.
  if (user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  // (payload, jwt_secret)
  const token = user.generateAuthToken();

  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.email().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return Joi.validate(req);
}

module.exports = router;
