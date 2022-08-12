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

## Awesome Express Middleware (Part3)
Built-in Middleware
- `express.static()`: HTML, CSS, 이미지 등과 같은 정적 자원(Static Assets)를 제공하는 미들웨어입니다.
- `express.json()`: JSON 형식의 요청을 처리하는 미들웨어입니다.
- `express.urlencoded()`: URL 인코딩 형식의 요청을 처리하는 미들웨어입니다.

Third-party Middleware
- helmet: `HTTP Headers`에 보안적인 정보를 추가하는 미들웨어입니다.
- cookie-parser: `Cookie`를 처리하는 미들웨어입니다.
- cors: `Cross-Origin Resource Sharing`을 지원하는 미들웨어입니다.
- passport: 구글, 페이스북, 트위터 등 Oauth 로그인을 지원하는 미들웨어입니다.
- morgan: `HTTP Request`의 상태 코드 및 요청 시간을 출력하는 미들웨어입니다. 
- https://blog.bitsrc.io/5-express-middleware-libraries-every-developer-should-know-94e2728f7503

`ajax.html` 코드를 보면,
```html
// public/ajax.html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <script>
      const init = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "John",
          age: 30,
        }),
      };

      fetch("http://localhost:3000/ajax", init)
        .then((res) => res.json())
        .then((data) => console.log(data));
    </script>
  </body>
</html>
```

`express.json()` 미들웨어를 추가하지 않은 경우, `application/json` 형태로 요청이 들어왔음에도, `req.body`에 어떤 값도 붙지 않은 것을 확인할 수 있습니다. 
- `express.json()` 미들웨어는 `application/json` 형태로 들어온 데이터를 파싱해 `req.body`에 붙여주는 기능을 합니다.
```javascript
// app.js
const express = require("express");
const helmet = require("helmet");
const app = express();

app.use(helmet());

app.use(express.static("public"));
// app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.post("/ajax", (req, res) => {
  console.log("req.headers", req.headers);
  console.log("------------------------------");
  console.log("req.body", req.body); // { }

  res.send({
    key: "value",
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

```javascript
const express = require("express");
const helmet = require("helmet");
const app = express();

app.use(helmet());

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
  console.log("req.body", req.body); // { name: "John", age: 30}
 
  res.send({
    key: "value",
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

## Responding with JSON (part4)
`POSTMAN`을 사용해서 `application/json` 형태로 응답하기.
- `res.send()` 함수는 기본값으로 `mime-type: text/html` 가집니다.
- `res.json()` 함수는 `object`를 `JSON.stringify()` 함수를 사용해 `JSON String`으로 변환해 응답하는 역할을 합니다. 

```javascript
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
```

- `urlencoded`: `&`로 분리되고, `=` 기호로 값과 키를 연결하는 `key-value` 튜플 형태로 인코딩되는 값입니다.
- `express.urlencoded()`: 해당 함수는 `urlencoded` 형태로 인코딩된 데이터를 파싱해 `req.body`에 붙여주는 기능을 합니다.
  - 해당 메소드에 일치하는 `요청(req)`만을 처리하는 `middleware`를 반환합니다.
- POST 요청은 보통 HTML 양식을 통해 서버에 전송하며, 서버에 변경사항을 만듭니다. 이 경우의 콘텐츠 유형(Content-Type)은 <form> 요소의 enctype 특성이나 <input>, <button> 요소의 formenctype 특성 안에 적당한 문자열을 넣어 결정합니다.
- application/x-www-form-urlencoded: &으로 분리되고 "=" 기호로 값과 키를 연결하는 key-value tuple로 인코딩되는 값입니다. 영어 알파벳이 아닌 문자들은 percent encoded 으로 인코딩됩니다., 이 content type은 바이너리 데이터에 사용하기에는 적절치 않습니다. (
- 이미지, 파일, 비디오 등의 이진 데이터(바이너리 디에터) 전송은 multipart/form-data 를 사용해야 합니다.
- https://thankee.tistory.com/85

```html
// index.html

<form method="POST" action="/" >
  <input type="text" name="user[name]" />
  <input type="text" name="user[email]" />
  <input type="submit" value="submit" />
</form>
```

```javascript
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: false }));

app.post("/", (req, res) => {
  const { name, email } = req.body.user;

  console.log("name: ", name);
  console.log("email: ", email);
});
```

`express.text([options])`
- 이 메소드는 `body(payload)`를 `String(문자열)` 형태로 파싱해 리턴합니다.

`express.raw([options])`
- 이 메소드는 `body(payload)`를 `Buffer` 형태로 파싱해 리턴합니다.

## Summary
```javascript
// express.js를 사용하기 위해 모듈을 불러옵니다.
const express = require("express");
// 변수 app에 Express 인스턴스를 생성합니다. 
const app = express();

// GET 방식으로 "/" 요청을 처리합니다.
app.get("/", (req, res) => {
  res.send("homepage");
});

// 3000번 포트에서 서버를 실행합니다.
app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

<img src="https://camo.githubusercontent.com/e1e8a60257a9529e74f3db358d160c5eeea0b787b89feeff0ff49efc048ca0d7/68747470733a2f2f6d656469612e766c70742e75732f696d616765732f6261656b313030382f706f73742f33336131346265392d386231662d346561352d623636612d3338316365366439383061342f254531253834253839254531253835254233254531253834253846254531253835254233254531253834253835254531253835254235254531253836254142254531253834253839254531253835254133254531253836254241253230323032312d31312d3033253230254531253834253842254531253835254139254531253834253932254531253835254145253230342e33382e33312e706e67" />

자동차 공장의 컨베이어 벨트는 일렬의 순서를 따라 진행됩니다. 추가, 수정, 삭제 등의 공정을 거쳐 자동차를 생산합니다. 물론 이 경우에 불량인 자동차도 선별합니다. `middleware`는 앱에서 컨베이어 벨트의 추가, 수정, 삭제 등의 공정을 담당합니다. `next()` 함수는 다음 공정으로 넘어가게 해주는 역할을 합니다. 

`middleware` 사용 예시
1. 모든 요청에 대해 로그를 출력하는 경우.

```javascript
const express = require("express");
const app = express();

function myLogger (req, res, next) {
  console.log("LOGGED");
  next();
}

app.use(myLogger);

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/json", (req, res) => {
  res.json({
    message: "Hello World",
  });
});
```

2. `POST` HTTP 요청의 `body(payload)`를 구조화하고 싶은 경우.
- `payload`: 데이터 전송부분 중에서 사용자에게 전송되는 데이터를 의미합니다.

```javascript
const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const app = express();

// app.use(express.json()); // jsonParser와 똑같은 기능을 합니다.

app.post("/api/users", jsonParser, (req, res) => {
  // req.body에는 객체(object) 형태로 paylaod가 담겨 있습니다.
});
```

3. 모든 요청에 `cors` 헤더를 추가하고 싶은 경우.

```javascript
const express = require("express");
const cors = require("cors");
const app = express();

// 모든 요청에 대해 CORS 허용합니다.
app.use(cors()); 

// 특정 요청에 대해 CORS 허용하는 경우
const cors = require("cors");

app.get("/product/:id", cors(), (req, res, next) => {
  res.json({ msg: "This is CORS-Enabled for a Single Route" });
});
```

4. 요청 헤더에 사용자 인증 정보가 담겨있는지 확인하고 싶은 경우, `HTTP Request`에 인증 토큰이 있는지를 판단하고, 인증 토큰이 있다면 사용자 인증 정보를 추출하고 싶은 경우. 반대로 없다면 오류를 출력하고 싶은 경우.

```javascript
const express = require("express");
const app = express();

app.use((req, res, next) => {
  // token 여부 확인
  if (req.headers.token) {
    req.isLoggedIn = true;
    next();
  } else {
    // 토큰 미보유시 error 메시지 출력 및 오류 코드 전송
    res.status(401).send("Unauthorized User...");
  }
});
```

5. express 서버에서 `POST` 방식의 데이터 처리.
```javascript
// app.js
const init = {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify({
        user: {
            name: "baek",
            email: "baek@example.com",
        },
    }),
};

fetch("/", init);

// express.js
const express = require("express");
const app = express();

app.use(express.json());


app.post("/", (req, res) => {
  const { name, email } = req.body.user;
})
```