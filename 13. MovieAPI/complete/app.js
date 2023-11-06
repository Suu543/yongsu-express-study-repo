const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");

const indexRouter = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json()); // req.body 붙여준다
app.use(
  express.urlencoded({
    extended: false,
  })
); // HTML Form 태그에서 제출된 데이터 - req.body 붙여준다
// name=yongsu?age=20

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/", indexRouter);
// localhost:3000/movie/5

app.listen(PORT || 3000, () => {
  console.log(`Listening on port ${PORT}`);
});
