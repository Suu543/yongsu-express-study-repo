const path = require("path");
const helmet = require("helmet");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res, next) => {
  res.send("Sanity");
});

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/process_login", (req, res, next) => {
  const { password, username } = req.body;

  // 1. Password + Username 조합으로 DB 검사
  // 2. DB 정보와 일치한다면
  // - cookie에 username 저장 ==> welcome page 전환

  if (password === "x") {
    // res.cookie는 2개의 인자를 받는다.
    // 1. cookie 이름
    // 2. cookie 값
    res.cookie("username", username);

    // res.redirect는 1개의 인자를 받는다.
    // 1. 전환할 페이지
    res.redirect("/welcome");
  } else {
    res.redirect("/login?msg=fail");
  }
});

app.get("/welcome", (req, res, next) => {
  res.render("welcome", {
    username: req.cookies.username,
  });
});

app.get("/logout", (req, res, next) => {
  // logout ==> cookie 제거
  res.clearCookie("username");
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
