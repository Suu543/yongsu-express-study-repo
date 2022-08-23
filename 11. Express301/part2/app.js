const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const express = require("express");
const app = express();

app.use(helmet());
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

app.use((req, res, next) => {
  if (req.query.msg === "fail") {
    // view engine has access to locals
    res.locals.msg = `Sorry, their username and password combination does not exist`;
  } else {
    res.locals.msg = ``;
  }

  next();
});

app.get("/", (req, res, next) => {
  // req 객체에는 query 속성이 존재합니다.
  // req.query는 객체 형태를 구성됩니다.
  // query string에는 이름과 같은 보안에 영향을 미치지 않는 값을 붙입니다.
  res.render("login");
});

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/process_login", (req, res, next) => {
  // urlencoded
  const { password, username } = req.body;

  if (password === "x") {
    res.cookie("username", username);
    res.redirect("/welcome");
  } else {
    res.redirect("/login?msg=fail&test=hello");
  }
});

app.get("/welcome", (req, res, next) => {
  res.render("welcome", {
    username: req.cookies.username,
  });
});

app.get("/logout", (req, res, next) => {
  res.clearCookie("username");
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
