// `Express.js` 프레임워크의 핵심 기능은 두 가지로 분류할 수 있습니다.
// 1. Router
// 2. Middleware
// - `middleware`는 이름 그대로 요청과 응답 사이에 로직을 추가할 때 유용하게 사용할 수 있습니다. 개인적으로는 보안 관련 작업에 사용합니다.

// 요청(req) =========== middleware =========== 응답(res)
// - req, res, next 객체에 접근할 수 있는 모든 함수를 middleware로 간주할 수 있습니다.

// 요청(req) =========== middleware =========== 응답(res)
// 1. 요청(req)이 들어옵니다.
// 2. 응답 전 사용자 검증 절차를 거칩니다.
// 3. 인증된 사용자 정보를 DB에 저장합니다.
// 4. 저장에 했다면 응답(res)으로 저장한 정보의 요약을 전달합니다.

const express = require("express");
const app = express();

function validateUser(req, res, next) {
  // res.locals 객체는 요청(req) 단계에서 정보를 응답(res) 단계로의 노출에 유용하게 사용할 수 있는 객체입니다.
  // 노출 정보는 요청 경로 이름, 인증된 사용자, 사용자 설정 등이 될 수 있습니다.
  console.log("Validating user");
  res.locals.validated = true;

  // express에서 next는 다음 단계로 넘어가게 해주는 역할을 합니다.
  // 만약 next()를 호출하지 않으면 응답(res)이 전달되지 않습니다.
  //  middleware 함수가 일렬의 로직을 실행하고 이 단계가 끝난 시점에 응답(res) 혹은 다음 middleware 함수로 넘어가게 하는 역할을 합니다.
  //  next() ==> 다음 단계로 넘어가게 해주는 문지기
  next();
}

app.use(validateUser);

app.get("/", (req, res, next) => {
  console.log(res.locals.validateUser);
  res.send("<h1>Homepage</h1>");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
