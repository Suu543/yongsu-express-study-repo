// Express 프레임워크를 가져옵니다.
const express = require("express");
// 파일 경로를 다루기 위한 Node.js 내장 모듈을 가져옵니다.
const path = require("path");
// HTTP 쿠키를 파싱하기 위한 미들웨어를 가져옵니다.
const cookieParser = require("cookie-parser");
// HTTP 요청 로거 미들웨어를 가져옵니다.
const logger = require("morgan");
// 보안에 도움을 주는 여러 HTTP 헤더를 설정하는 미들웨어를 가져옵니다.
const helmet = require("helmet");
// 환경 변수를 .env 파일에서 프로세스 환경으로 로드하는 모듈을 가져옵니다.
const dotenv = require("dotenv");

// 라우트 정의가 있는 파일을 가져옵니다.
const indexRouter = require("./routes/index");

// Express 애플리케이션을 생성합니다.
const app = express();
// 환경 변수에서 포트를 가져오거나 기본값으로 3000을 사용합니다.
const PORT = process.env.PORT || 3000;

// dotenv를 사용하여 .env 파일의 환경 변수를 로드합니다.
dotenv.config();

// helmet을 사용하여 앱의 보안을 강화합니다. 일부 옵션은 CSP와 COEP를 비활성화합니다.
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
// 뷰 엔진으로 'ejs'를 설정합니다. 'views' 폴더 안의 템플릿을 렌더링합니다.
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// morgan 로거를 'dev' 설정으로 사용하여 요청 로그를 출력합니다.
app.use(logger("dev"));
// express.json()을 사용하여 JSON 요청 본문을 파싱합니다.
app.use(express.json());
// express.urlencoded()을 사용하여 URL 인코딩된 요청 본문을 파싱합니다.
app.use(
  express.urlencoded({
    extended: false,
  })
);

// 정적 파일들을 제공하기 위해 'public' 폴더를 사용합니다.
app.use(express.static(path.join(__dirname, "public")));
// 쿠키 파서를 사용하여 요청에 동봉된 쿠키를 파싱합니다.
app.use(cookieParser());

// '/' 경로로 오는 요청들을 indexRouter로 처리하도록 라우팅합니다.
app.use("/", indexRouter);

// 서버를 설정한 포트로 리스닝하도록 설정하고, 콘솔에 포트 번호를 출력합니다.
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
