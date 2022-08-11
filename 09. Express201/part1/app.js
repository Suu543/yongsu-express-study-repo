const express = require("express");
const app = express();

function validateUser(req, res, next) {
  console.log("Validating user");
  res.locals.validated = true;

  next();
}

app.use(validateUser);

app.get("/", (req, res, next) => {
  console.log("Hello");
  console.log(res.locals.validateUser);
  res.send("<h1>Homepage</h1>");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
