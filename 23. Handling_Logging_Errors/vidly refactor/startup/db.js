const winston = require("winston");
const mongoose = require("mongoose");
const Fawn = require("fawn");

module.exports = function () {
  mongoose
    .connect("mongodb://127.0.0.1:27017/vidly")
    .then(() => winston.info("Connected to MongoDB..."));
  // winston promise rejection에 의해 처리됩니다.
  // .catch((err) => winston.error("Could not connect to MongoDB..."));

  Fawn.init("mongodb://127.0.0.1:27017/vidly");
};
