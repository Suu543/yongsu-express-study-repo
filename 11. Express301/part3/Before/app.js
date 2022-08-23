const express = require("express");
const app = express();

app.get("/story/1", (req, res, next) => {
  res.send("<h1>Story 1</h1>");
});

app.get("/story/2", (req, res, next) => {
  res.send("<h1>Story 2</h1>");
});

app.get("/story/3", (req, res, next) => {
  res.send("<h1>Story 3</h1>");
});

