const express = require("express");
const app = express();
const helmet = require("helmet");
const logger = require("morgan");
const router = require("./theRouter");
const userRouter = require("./userRouter");

app.use(helmet());
app.use(express.urlencoded());
app.use(express.json());
app.use(logger("dev"));
app.use(express.static("public"));

app.use("/", router);
app.use("/user", userRouter);

// /movie
// /movie/search
// /person/search
// /person/id
// /tv/search
// /tv/id

app.listen(3000);
