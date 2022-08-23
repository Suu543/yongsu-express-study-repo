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

app.param("id", (req, res, next, id) => {
  console.log("Params called: ", id);
  next();
});

app.get("/loadStatement", (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "userStatements/BankStatementChequing.png")
  );
});

app.get("/downloadStatement", (req, res, next) => {
  // app.download 함수는 세 개의 인자를 받습니다.
  // 1. 파일이름
  // 2. 파일명 (저장시 이름)
  // 3. 에러처리

  res.download(
    path.join(__dirname, "userStatements/BankStatementChequing.png"),
    "JimsStatement.png",
    (error) => {
      // if there is an error in sending the File, headers may already be sent!
      if (error) {
        // res.headerSent is a bool, true if headers are already sent!
        if (!res.headersSent) {
          res.redirect("/download/error");
        }
      }
      console.log(error);
    }
  );
});

app.get("/logout", (req, res, next) => {
  // res.clearCookie takes 1 arg:
  // 1. Cookie to clear (by name)
  res.clearCookie("username");
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
