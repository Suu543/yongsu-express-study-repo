const path = require("path");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const comments = [
  {
    username: "First",
    comment: "This is first",
  },
  {
    username: "Second",
    comment: "This is Second",
  },
  {
    username: "Third",
    comment: "This is Third",
  },
  {
    username: "Fourth",
    comment: "This is Fourth",
  },
  {
    username: "Fifth",
    comment: "This is Fifth",
  },
  {
    username: "Sixth",
    comment: "This is Sixth",
  },
];

app.get("/comments", (req, res, next) => {
  res.render("comments/index", { comments });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
