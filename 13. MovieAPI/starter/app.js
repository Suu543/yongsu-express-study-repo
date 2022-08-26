const path = require("path");
const createError = require("http-errors");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");
const express = require("express");
dotenv.config();

// routes
const indexRouter = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;

// 3rd-Party Middlewares
app.use(helmet());
app.use(logger("dev"));

// View Engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Express Built-In Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

// Route
app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
