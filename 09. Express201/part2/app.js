const express = require("express");
const app = express();

function validateUser(req, res, next) {
  console.log("Validating user");
  res.locals.validated = true;
  next();
}

app.use("/admin", validateUser);

app.get("/", (req, res, next) => {
  console.log(res.locals.validateUser); // undefined
  res.send("<h1>Homepage</h1>");
});

app.get("/admin", (req, res, next) => {
  console.log(res.locals.validateUser); // true
  res.send("<h1>Admin page</h1>");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

app.get(
  "/",
  (req, res, next) => {
    console.log("Validated user");
    res.locals.validated = true;
    next();
  },
  (req, res) => {
    console.log("Got a request");
    console.log(res.locals.validated); // true
    res.send("<h1>Homepage</h1>");
  }
);
