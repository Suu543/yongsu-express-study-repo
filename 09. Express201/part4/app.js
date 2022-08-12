const express = require("express");
const helmet = require("helmet");
const app = express();

app.use(helmet());

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.post("/arr", (req, res) => {
  const data = ["Test", 1, 2, 3, 4];

  console.log(req.body);
  res.json(data);
});

app.post("/obj", (req, res) => {
  const data = {
    key1: "value1",
    key2: "value2",
  };

  console.log(req.body);
  res.json(data);
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
