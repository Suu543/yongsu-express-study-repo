const express = require("express");
const app = express();

app.use((req, res, next) => {
  console.log(req);

  next();
});
app.use(express.urlencoded({ extended: true }));

app.get("/tacos", (req, res) => {
  res.send("GET /tacos response");
});

app.post("/tacos", (req, res) => {
  const { meat, qty } = req.body;
  // console.log(req.body);
  // res.send("POST /tacos response");
  res.send(`Ok, here are your ${qty} ${meat} tacos`);
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
