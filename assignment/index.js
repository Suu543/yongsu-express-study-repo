function validateUser(req, res, next) {
  // 사용자 인증 로직
  res.locals.validated = true;
  res.locals.name = "yongsu";
  res.locals.nickname = "yongyong";

  next();
}

const path = require("path");
const express = require("express");
const app = express();

app.use(express.static("public"));
app.use(express.static("files"));

// Template Engine을 설정할 때 사용합니다
app.set("view engine", "ejs");
// 탬플릿 파일이 있는 폴더 지정
app.set("views", path.join(__dirname, "views"));

// app.use(express.json()); // application/json
// app.use(express.urlencoded({ extended: false }));

app.use(validateUser);

app.get("/", (req, res) => {
  // View Engine을 응답으로 전달할 때 ==>  res.render
  // Convention: 약속/규칙:
  // 1. middleware를 타고 내려온 데이터에 접근하고 싶은경우: res.locals
  // 2. render 함수의 두번째 인자로 전달한 데이터는 locals빼고, 바로 키 값을 접근할 수 있다.

  res.render("index");
});

app.post("/", (req, res) => {
  console.log(req.body);
});

app.post("/test", (req, res) => {
  console.log(req.body);
  res.status(200).json({
    합체: `${req.body.name}는 ${req.body.age} 살 입니다.`,
  });
});

app.post("/user", (req, res) => {
  console.log(req.body.title);
});

app.listen(3000, () => {
  console.log("3000번에서 실행하고 있습니다");
});
