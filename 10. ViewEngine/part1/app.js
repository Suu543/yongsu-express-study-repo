const path = require("path");
const express = require("express");
const helmet = require("helmet");
const app = express();

app.use(helmet());
// static file (정적 파일) 설정 ==> 폴더 이름은 public
app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// template engine 설정
app.set("view engine", "ejs");
// 템플릿 파일이 있는 폴더 지정
app.set("views", path.join(__dirname, "views"));
// 만약 두 개 이상의 views 폴더를 추가하고 싶은 경우 배열을 사용할 수 있습니다.
// app.set("views", [path.join(__dirname, "views"), path.join(__dirname, "views2")]);

// 매 요청마다 HTML, CSS, JavaScript 전체를 전달하는 방식 (res.render)
// server side rendering 방식

function validateUser(req, res, next) {
  res.locals.validated = true;
  res.locals.name = "hello";
  res.locals.nickname = "world";
  next();
}

app.use(validateUser);
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data:"],
    },
  })
);

// res.render
// 첫 번째 인자: 템플릿 파일 이름
// 두 번째 인자: 템플릿 파일에 전달할 데이터
app.get("/", (req, res, next) => {
  res.render("index", {
    msg: "Success!",
    msg2: "Failure!",
    html: `<p><img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSdH6m8uo9xKBhK7z_YqOXo5qwMUDYciOWQqzvtqawG4lcA-2OTf0q6v6nL5yfmUw-Rz2o&usqp=CAU" /></p>`,
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
