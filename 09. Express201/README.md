# Express201 - Middleware
<img src="https://camo.githubusercontent.com/30a086e403d837b1be36f2667f3429976bc08054786468fcc42cd011e78610b6/68747470733a2f2f63646e2d696d616765732d312e6d656469756d2e636f6d2f6d61782f3830302f312a7436423245535968516c494a4c537270336e637961512e706e67" />

## Middleware
`Express.js` 프레임워크의 핵심 기능은 두 가지로 분류할 수 있습니다.
1. Router
2. Middleware 
- `middleware`는 이름 그대로 요청과 응답 사이에 로직을 추가할 때 유용하게 사용할 수 있습니다. 개인적으로는 보안 관련 작업에 사용합니다.

요청(req) =========== middleware =========== 응답(res)
- req, res, next 객체에 접근할 수 있는 모든 함수를 middleware로 간주할 수 있습니다.

요청(req) =========== middleware =========== 응답(res)
1. 요청(req)이 들어옵니다.
2. 응답 전 사용자 검증 절차를 거칩니다.
3. 인증된 사용자 정보를 DB에 저장합니다.
4. 저장에 했다면 응답(res)으로 저장한 정보의 요약을 전달합니다.

```javascript
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
```

`app.use()`
- 정의한 순서대로 해당 서버로 요청이 들어오면 인자로 전달한 `middleware` 함수를 실행합니다.
1. `app.use()`를 여러 개 정의했을 때 순서대로 정의한 순서대로 동작합니다.
2. `middleware` 함수 내부에서 요청(req)과 응답(res) 객체에 접근해 정의한 로직에 따라 객체 내부의 값에 추가, 삭제, 변경, 조희 등의 작업을 할 수 있습니다.
3. 각 `middleware`가 종료되는 시점에 리턴 값처럼 반드시 `next()` 함수를 호출해서 다음 `middleware` 혹은 `요청(res)`으로 넘어가야 합니다.
4. `next()` 함수를 호출하지 않으면 서버가 멈추는 현상이 발생합니다.
5. `app.use()` 함수의 첫 번째 인자에 특정 라우터 혹은 url을 정의하면, 해당 라우터에 들어온 요청에만 `middleware`가 동작합니다. (Part2 코드 참조).


`res.locals`
- res.locals 객체는 요청(req) 단계에서 정보를 응답(res) 단계로의 노출에 유용하게 사용할 수 있는 객체입니다. 노출 정보는 요청 경로 이름, 인증된 사용자, 사용자 설정 등이 될 수 있습니다.

`next()`
- next() ==> 다음 단계로 넘어가게 해주는 문지기
- express에서 next는 다음 단계로 넘어가게 해주는 역할을 합니다. 만약 next()를 호출하지 않으면 응답(res)이 전달되지 않습니다.
- middleware 함수가 일렬의 로직을 실행하고 이 단계가 끝난 시점에 응답(res) 혹은 다음 middleware 함수로 넘어가게 하는 역할을 합니다.

`middleware` 함수를 풀어 적으면 다음과 같은 형태를 띕니다.
```javascript
const express = require("express");
const app = express();

function validateUser(req, res, next) {
    console.log("Validated user");
    res.locals.validated = true;
    next();
}

// version #1
app.use(validateUser); // 모든 요청에 적용됩니다.

// version #2
app.use("/admin", validateUser); // /admin 요청에만 적용됩니다.

// version #3 // 이렇게 적용하면 특정 라우터에만 적용됩니다.
app.get("/", validateUser, (req, res) => {
    console.log("Got a request");
    console.log(res.locals.validated); // true
    res.send("<h1>Homepage</h1>");
}

// version #3을 풀어 적으면 다음과 같은 형태를 띱니다.
app.get(
  "/",
  (req, res, next) => {
    console.log("Validated user");
    res.locals.validated = true;
    next();
  },
  (req, res) => {
    console.log("Got a request");
    console.log(res.locals.validated); // true
    res.send("<h1>Homepage</h1>");
  }
);


app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
```

