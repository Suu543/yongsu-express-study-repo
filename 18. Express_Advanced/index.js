const debug = require("debug")("app:startup");
const config = require("config");
const Joi = require("joi");
const logger = require("./middleware/logger");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

// routes
const home = require("./routes/home");
const courses = require("./routes/courses");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

app.use("/", home);
app.use("/api/courses", courses);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan Enabled...");
}

app.use(morgan("dev"));

app.use(logger);

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
