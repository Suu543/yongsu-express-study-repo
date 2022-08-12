const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.post("/ajax", (req, res) => {
  console.log("------------------------------");
  console.log("req.headers", req.headers);
  console.log("req.body", req.body);

  res.send({
    key: "value",
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
