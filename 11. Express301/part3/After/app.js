const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  if (req.query.msg === "fail") {
    // view engine has access to locals
    res.locals.msg = `Sorry, this username and password combination does not exist!`;
  } else {
    // Leave it as an empty string
    res.locals.msg = ``;
  }

  // Send me on to the next piece of middleware
  next();
});

app.get("/", (req, res, next) => {
  res.send("Sanity");
});

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/process_login", (req, res, next) => {
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

// app.params() 함수는 두 개의 인자를 받습니다.
// 1. ":이름" 형태의 route
// 2. 콜백 ==> ":이름" 형태의 인자가 있다면, 콜백의 네 번째 인자에 붙여줍니다.
app.param("id", (req, res, next, id) => {
  console.log("Params Called: ", id);

  // app.get("/user/:id", ...);
  // app.get("/user/admin/:id", ...)
  // app.get("/user/profile/:id", ...)
  next();
});

app.get("/story/:id", (req, res, next) => {
  res.send(`<h1>Story ${req.params.id}</h1>`);
});

app.get("/story/:storyId/:link", (req, res, next) => {
  res.send(`<h1>Story ${req.params.storyId} - ${req.params.link}</h1>`);
});

app.get("/story/:storyId/link", (req, res, next) => {
  res.send(`<h1>Story ${req.params.storyId}</h1>`);
});

app.get("/test/:storyId", (req, res, next) => {
  res.send(`<h1>Story ${req.params.storyId}</h1>`);
});

// THIS WILL NEVER RUN, because it matches above (without next())
// next 함수를 호출하지 않는 한 위의 경우와 패턴이 겹치기 때문에 호출되지 않습니다.
// app.get("/test/:blogId", (req, res, next) => {
//   res.send(`<h1>Blog ${req.params.blogId}</h1>`);
//   next();
// });

app.get("/logout", (req, res, next) => {
  res.clearCookie("username");
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
