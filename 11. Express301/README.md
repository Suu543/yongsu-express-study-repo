# Express 301

## Cookie and Session
웹 개발에서 `cookie`와 `session`은 빈번히 사용되는 기술입니다. 두 기술의 활용방안은 다양하지만, 존재목적은 `HTTP` 프로토콜의 특징이자 약점을 보완하기 위함이라 생각합니다. 

HTTP Protocol의 특징
1. 비연결성 지향 (Connectionless Protocol)
- 클라이어트가 서버에 요청 시, 그 요청에 맞는 응답을 보낸 후 연결을 끊는 처리방식을 의미합니다.
- `HTTP 1.1` 버전에서는 연결을 계속 유지하고 요청을 재활용하는 기능이 추가되었습니다. `HTTP Header`에 `keep-alive` 옵션을 주어 연결을 재활용할 수 있습니다.
- `HTTP`가 `TCP` 위에 구현되었기 때문에 `(TCP: 연결 지향, UDP: 비연결 지향)` 연결 지향적이라고 할 수 있어 논란이 있을 수 있지만, 네트워크 관점에서 `keep-alive`은 옵션으로 두고, 서버 측에서 비연결 지향 특성으로 연결 시 발생하는 비용을 줄이는 것을 명확한 장점으로 보기 때문에 비연결 지향으로 이해하는 것이 좋습니다.

2. 비상태성 (Stateless Protocol)
- 연결을 끊는 순간 클라이언트와 서버의 통신이 끝나며, 정보를 유지하지 않는 특성이 있습니다.
- 클라이언트와 첫 번째 통신에서 데이터를 주고받았음에도, 정보를 유지하지 않기 때문에 두 번째 통신에서 해당 데이터에 접근할 수 없습니다. 
- 하지만 여러 번 요청/응답이 반복되는 경우 이전 데이터가 필요한 경우가 많습니다. 예를 들어, 정보가 유지도지 않으면, 페이지를 이동할 때마다 다시 로그인하거나, 상품을 선택했음에도, 구매 페이지에 나타나지 않는 등의 문제가 발생할 수 있습니다. 
- 이런 `HTTP` 프로토콜의 비상태성 특성을 살리면서 동시에 상태를 유지하기 위한 목적으로 `Cookie and Session`을 사용합니다.
- `Cookie and Session`의 차이점은 상태 정보의 저장 위치입니다.
  - `Cookie`: 클라이언트 (Local Computer)
  - `Session`: 서버

요약하자면, 서버와 클라이언트가 `HTTP Protocol` 방식으로 통신할 때 통신이 연속적으로 이어지지 않고 한 번 요청/응답 사이클을 돌면 통신이 끊어집니다. 결국 서버는 클라이언트가 누구인지 계속 인증해야 하는 번거로움이 발생합니다. 이 같은 번거로움을 해결하는 방법이 바로 `Cookie and Session`의 활용입니다.


### Cookie
`HTTP`의 일종으로 클라이언트(사용자)가 어떤 웹 사이트를 방문할 경우, 해당 서비스의 서버에서 사용자의 컴퓨터에 저장하는 작은 기록 정보 파일입니다. `HTTP`에서 클라이언트의 상태 정보가 브라우저에서 제공하는 `Cookie` 등에 저장되기 때문에 필요할 때 정보를 참조하거나 재사용할 수 있습니다.

`Cookie` 특징
- 이름, 값, 만료일(저장기간), 경로 정보 등으로 구성됩니다.
- 클라이언트는 총 300개의 `Cookie`를 저장할 수 있습니다.
- 하나의 도메인 당 20개의 `Cookie`를 가질 수 있습니다.
- 하나의 `Cookie`는 4KB(=4096byte)까지 저장 가능합니다.

`Cookie` 동작 순서

1. 클라이언트가 페이지를 요청한다. (웹사이트에 접근)
2. 웹 서버는 `Cookie`를 생성한다.
3. 생성한 `Cookie`에 정보를 담아 `HTTP` 화면을 돌려줄 때, 같이 클라이언트에 전달합니다.
4. 전달받은 `Cookie`는 클라이언트(브라우저 or Local Computer)가 가지고 있다가, 다시 서버에 요청 시, 요청과 함께 `Cookie`를 전달합니다.
5. 동일 사이트 재방문 시 클라이언트 PC에 해당 `Cookie`가 있는 경우, 요청 페이지와 함께 쿠키를 전송합니다.

`Cookie` 사용 예시
- 로그인 시, `아이디와 비밀번호를 저장하시겠습니다?`
- 팝업창을 통해 `오늘 이 창을 다시 보지 않기` 클릭

### Sessions
일정 시간 동안 같은 사용자(브라우저)로부터 들어오는 요청을 하나의 상태로 간주하고, 이 상태를 유지하는 기술입니다. 여기서 의미하는 일정 시간은 방문자가 웹 브라우저를 통해 웹 서버에 접속한 시점부터, 웹 브라우저를 종료해 연결을 끝내는 시점을 의미합니다. 방문자가 웹 서버에 접속해 있는 상태를 하나의 단위로 보고 그것을 `Session(세션)`이라합니다. 

`Session(세션) 특징`
- 웹 서버에 웹 컨테이너의 상태를 유지하기 위한 정보를 저장합니다.
- 웹 서버에 저장되는 쿠키(=세션 쿠키)
- 브라우저를 닫거나, 서버에서 세션을 삭제했을 때만 삭제되므로, 쿠키보다 비교적 안전합니다.
- 저장 데이터에 제한이 없습니다. (서버 용량이 허용하는 한도에서)
- 각 클라이언트에 고유 `Session ID`를 부여합니다. `Session ID`로 클라이언트를 구분해 각 요구에 맞는 서비스를 제공합니다.

`Session(세션) 동작 순서`
1. 클라이언트가 서버에 페이지를 요청합니다. (사용자가 웹사이트에 접근)
2. 서버는 접근한 클라이언트의 `Request-Header` 필드인 `Cookie`를 확인하고, 클라이언트가 해당 `Session-ID`를 보냈는지 확인합니다.
3. `Session-ID`가 존재하지 않는다면 서버는 `Session-ID`를 생성해 클라이언트에게 전달합니다.
4. 클라이언트는 재접속 시, 이 쿠키를 이용해 `Session-ID`값을 서버에 전달합니다.

`Session(세션) 예시`
- 화면을 이동해도 로그인이 풀리지 않고, 로그아웃 전까지 유지

### Cookie vs Session
- 쿠키와 세션은 비슷한 역할을 하고, 동작원리 또한 비슷합니다. 그 이유는 세션도 결국 쿠키를 사용하기 때문입니다.
- 가장 큰 차이점은 사용자의 정보가 저장되는 위치입니다. 쿠키는 서버의 자원을 전혀 사용하지 않는 반면에, 세션은 서버의 자원을 사용합니다.
- 보안의 측면에서는 세션이 쿠키보다 더 안전합니다.
- 쿠키는 클라이언트 로컬에 저장되기 때문에 변질되거나 request에서 탈취 우려가 있어 보안에 취약하지만, 세션은 쿠키를 이용해 `session-id`만 저장해, 이를 서버에서 처리하기 때문에 비교적 보안성이 높습니다.
- 쿠키는 파일로 저장되기 때문에 브라우저를 종료해도 정보가 유지될 수 있습니다. 만료기간을 따로 지정해 쿠키를 삭제할 때까지 유지할 수 있습니다. 반면에 세션은 만료기간을 정할 수 있지만, 브라우저가 종료되면 만료기간에 상관없이 삭제됩니다.
- 속도 면에서 쿠키가 우수합니다. 쿠키는 쿠키에 정보가 있기 때문에 서버에 요청 시 속도가 빠르고, 세션은 정보가 서버에 있기 때문에 일렬의 과정을 때문에 비교적 느린 속도를 냅니다. 

- 세션이 쿠키와 비교하면 보안이 높은 편임에도, 쿠키를 사용하는 이유는 세션은 서버에 저장되고, 서버의 자원을 사용하기에, 서버 자원에 한계가 있고, 속도가 느려질 수 있기 때문에 자원관리 차원에서 쿠키와 세션을 잘 조합해 서버 자원의 낭비를 방지하며 웹사이트의 속도를 높일 수 있습니다.

### Cache
`Cache(캐시)`는 웹 페이지 요소를 저장하기 위한 임시 저장소입니다. 쿠키/세션은 정보를 저장하기 위해 사용합니다. `Cache(캐시)`는 웹 페이지를 빠르게 렌더링할 수 있도록 도와주고, 쿠키/세션은 사용자 인증을 도와줍니다.
- `Cache(캐시)`는 이미지, 비디오, 오디오, css, js파일 등 데이터나 값을 미리 복사해 놓는 리소스 파일들의 임시 저장소입니다.
- 저장 공간이 작고 비용이 비싼 대신 빠른 성능을 제공합니다.
- 같은 웹 페이지에 접속할 때 사용자의 PC에서 로드하므로 서버를 거치지 않아도 됩니다.
- 이전에 사용된 데이터가 다시 사용될 가능성이 많으며 캐시 서버에 있는 데이터를 사용합니다. 그래서 다시 사용될 확률이 있는 데이터들에 빠르게 접근할 수 있습니다. 
- 캐시 히트(hit): 캐시를 사용할 수 있는 경우 (ex. 이전에 왔던 요청이랑 같은 게 왔을 때)
- 캐시 미스(miss): 캐시를 사용할 수 없는 경우 (ex. 웹서버로 처음 요청했을 때) 

References:
- https://dev-coco.tistory.com/61

## Forms and Cookies
- code: part1 
- https://sjh836.tistory.com/154
- http://expressjs.com/en/api.html#res.locals
- cookies
- redirect
- clearCookie


`res.cookie()`
- 쿠키를 응답으로 전달할 때 사용하는 함수입니다.
- 첫 번째 인자: `cookie-name`
- 두 번째 인자: `cookie-value` 

1. `cookie`를 사용하기 위해 `cookie-parser` 모듈을 설치합니다. 
2. 서버는 `cookie`를 브라우저로 전달하면서 동시에 브라우저가 요청가 함께 전달한 `cookie`를 읽어오기 위해 `cookieParser` 미들웨어를 추가합니다.
3. `res.cookie`는 쿠키를 응답으로 전달할 때 사용하는 함수입니다.
4. 요청으로 들어온 쿠키는 `req.cookies.[cookieName]`의 방식으로 접근할 수 있습니다.

`res.redirect()`
- 서버가 `HTTP` 응답 메세지를 통해 다른 `URL`로 전환하는 것을 의미합니다.
- 예를 들어, 쇼핑할 때 로그인하지 않은 상태에서 결제 창을 클릭했다면, 자동으로 로그인 페이지로 넘어가고 이후 결제 창에 접근할 수 있습니다.
- 첫 번째 인자: `URL`
- https://webstone.tistory.com/65

```javascript
const path = require("path");
const helmet = require("helmet");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const app = express();

app.use(helmet());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res, next) => {
  res.send("Sanity");
});

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/process_login", (req, res, next) => {
  const { password, username } = req.body;

  // 1. Password + Username 조합으로 DB 검사
  // 2. DB 정보와 일치한다면
  // - cookie에 username 저장 ==> welcome page 전환

  if (password === "x") {
    // res.cookie는 2개의 인자를 받는다.
    // 1. cookie 이름
    // 2. cookie 값
    res.cookie("username", username);

    // res.redirect는 1개의 인자를 받는다.
    // 1. 전환할 페이지
    res.redirect("/welcome");
  } else {
    res.redirect("/login?msg=fail");
  }
});

app.get("/welcome", (req, res, next) => {
  res.render("welcome", {
    username: req.cookies.username,
  });
});

app.get("/logout", (req, res, next) => {
  // logout ==> cookie 제거
  res.clearCookie("username");
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
```

```javascript
// views/login.ejs
<link rel="stylesheet" type="text/css" href="/stylesheets/style.css" />
<div class="login-page">
  <div class="form">
    <h2>Name will be placed here</h2>
    <form action="/process_login" method="post" class="login-form">
      <input type="text" placeholder="username" name="username" />
      <input type="password" placeholder="password" name="password" />
      <button>login</button>
      <p class="message">Not registered? <a href="#">Create an account</a></p>
    </form>
  </div>
</div>

// views/welcome.ejs
<link rel="stylesheet" type="text/css" href="/stylesheets/style.css" />
<div class="login-page">
  <div class="form">
    <h1>Welcome, <%= username %> back to the site!</h1>
    <p><a href="/logout">Logout</a></p>
  </div>
</div>
```

## Getting Data from the QueryString
- code: part2
- res.locals
  - `template engine`에서 `render` 함수가 두 번째 인자로 전달한 값에 접근할 때 사용할 수 있습니다.
- req.query
  - `url` 패러미터를 추출할 때 사용합니다.

```javascript
const path = require("path");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const express = require("express");
const app = express();

app.use(helmet());
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  if (req.query.msg === "fail") {
    // view engine has access to locals
    res.locals.msg = `Sorry, their username and password combination does not exist`;
  } else {
    res.locals.msg = ``;
  }

  next();
});

app.get("/", (req, res, next) => {
  // req 객체에는 query 속성이 존재합니다.
  // req.query는 객체 형태를 구성됩니다.
  // query string에는 이름과 같은 보안에 영향을 미치지 않는 값을 붙입니다.
  res.render("login");
});

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/process_login", (req, res, next) => {
  // urlencoded
  const { password, username } = req.body;

  if (password === "x") {
    res.cookie("username", username);
    res.redirect("/welcome");
  } else {
    res.redirect("/login?msg=fail&test=hello");
  }
});

app.get("/welcome", (req, res, next) => {
  res.render("welcome", {
    username: req.cookies.username,
  });
});

app.get("/logout", (req, res, next) => {
  res.clearCookie("username");
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
```

```javascript
// views/login.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
    <link rel="stylesheet" type="text/css" href="/stylesheets/style.css" />
  </head>
  <body>
    <div class="login-page">
      <div class="form">
        <h2><%= msg %></h2>
        <form action="/process_login" method="post" class="login-form">
          <input type="text" placeholder="username" name="username" />
          <input type="password" placeholder="password" name="password" />
          <button>login</button>
          <p class="message">
            Not registered? <a href="#">Create an account</a>
          </p>
        </form>
      </div>
    </div>
  </body>
</html>
```

## Getting Data from Params (URL Wildcards)
- code: part3
`URL Wildcards`: `/story/1`, `/story/2`, `/story/3` 등과 같은 패턴으로 이어진다면, `/story` 부분이 계속해서 반복되는 점을 확인할 수 있습니다. 이와 같은 형태의 `route`를 처리할 때 `URL Wildcards`를 활용할 수 있습니다.

### Before Wildcard
```javascript
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
```

### After Wildcard
`wildcard`에 접근하는 방법은 크게 두 가지가 있습니다.
1. `app.params()` ==> 모든 라우터에 대하여 특정 `wildcard` 사용 시 실행되는 미들웨어
2. `req.params.[이름]` ==> 특정 라우터의 `wildcard`를 추출할 때 사용하는 속성

```javascript
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

app.use(helmet());
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  if (req.query.msg === "fail") {
    // view engine has access to locals
    res.locals.msg = `Sorry, this username and password combination does not exist!`;
  } else {
    // Leave it as an empty string
    res.locals.msg = ``;
  }

  // Send me on to the next piece of middleware
  next();
});

app.get("/", (req, res, next) => {
  res.send("Sanity");
});

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/process_login", (req, res, next) => {
  const { password, username } = req.body;

  if (password === "x") {
    res.cookie("username", username);
    res.redirect("/welcome");
  } else {
    res.redirect("/login?msg=fail&test=hello");
  }
});

app.get("/welcome", (req, res, next) => {
  res.render("welcome", {
    username: req.cookies.username,
  });
});

// app.params() 함수는 두 개의 인자를 받습니다.
// 1. ":이름" 형태의 route
// 2. 콜백 ==> ":이름" 형태의 인자가 있다면, 콜백의 네 번째 인자에 붙여줍니다.
app.param("id", (req, res, next, id) => {
  console.log("Params Called: ", id);

  // app.get("/user/:id", ...);
  // app.get("/user/admin/:id", ...)
  // app.get("/user/profile/:id", ...)
  next();
});

app.get("/story/:id", (req, res, next) => {
  res.send(`<h1>Story ${req.params.id}</h1>`);
});

app.get("/story/:storyId/:link", (req, res, next) => {
  res.send(`<h1>Story ${req.params.storyId} - ${req.params.link}</h1>`);
});

app.get("/story/:storyId/link", (req, res, next) => {
  res.send(`<h1>Story ${req.params.storyId}</h1>`);
});

app.get("/test/:storyId", (req, res, next) => {
  res.send(`<h1>Story ${req.params.storyId}</h1>`);
});

// THIS WILL NEVER RUN, because it matches above (without next())
// next 함수를 호출하지 않는 한 위의 경우와 패턴이 겹치기 때문에 호출되지 않습니다.
// app.get("/test/:blogId", (req, res, next) => {
//   res.send(`<h1>Blog ${req.params.blogId}</h1>`);
//   next();
// });

app.get("/logout", (req, res, next) => {
  res.clearCookie("username");
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("Listening on port 3000...");
});
```

## Sending Files and Headers Already sent!
- code: part4
- `app.param`
- `res.sendFile`
  - `res.sendFile` 함수는 첫 번째 인자로 받은 파일을 읽어와 화면에 렌더링합니다.
- `res.download`
  - `res.download` 함수는 세 개의 인자를 받습니다.
  - 1. 파일이름
  - 2. 파일명 (저장시 이름)
  - 3. 에러처리


```javascript
const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

app.use(helmet());
app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(cookieParser());
app.use(morgan("dev"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use((req, res, next) => {
  if (req.query.msg === "fail") {
    // view engine has access to locals
    res.locals.msg = `Sorry, this username and password combination does not exist!`;
  } else {
    // Leave it as an empty string
    res.locals.msg = ``;
  }

  // Send me on to the next piece of middleware
  next();
});

app.get("/", (req, res, next) => {
  res.send("Sanity");
});

app.get("/login", (req, res, next) => {
  res.render("login");
});

app.post("/process_login", (req, res, next) => {
  const { password, username } = req.body;

  if (password === "x") {
    res.cookie("username", username);
    res.redirect("/welcome");
  } else {
    res.redirect("/login?msg=fail&test=hello");
  }
});

app.get("/welcome", (req, res, next) => {
  res.render("welcome", {
    username: req.cookies.username,
  });
});

app.param("id", (req, res, next, id) => {
  console.log("Params called: ", id);
  next();
});

app.get("/loadStatement", (req, res, next) => {
  res.sendFile(
    path.join(__dirname, "userStatements/BankStatementChequing.png")
  );
});

app.get("/downloadStatement", (req, res, next) => {
  // app.download 함수는 세 개의 인자를 받습니다.
  // 1. 파일이름
  // 2. 파일명 (저장시 이름)
  // 3. 에러처리

  res.download(
    path.join(__dirname, "userStatements/BankStatementChequing.png"),
    "JimsStatement.png",
    (error) => {
      // if there is an error in sending the File, headers may already be sent!
      if (error) {
        // res.headerSent is a bool, true if headers are already sent!
        if (!res.headersSent) {
          res.redirect("/download/error");
        }
      }
      console.log(error);
    }
  );
});

app.get("/logout", (req, res, next) => {
  // res.clearCookie takes 1 arg:
  // 1. Cookie to clear (by name)
  res.clearCookie("username");
  res.redirect("/login");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
```

## 자주 발생하는 오류
Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client
- `res.json` 시점에서 이미 `headers`를 전송했고 동시에 내부적으로 함수 리턴이 발생했기 때문에 위와 같은 오류가 발생합니다.
```javascript
app.get("/statement", (req, res, next) => {

    res.json({ msg: "test" });
    res.send("Hello World");
})
```

## Router
- code: part5
`express.Router()`는 앱 안의 앱이라 생각할 수 있습니다. `app.js`와 같은 하나의 파일에 `routes`와 관련한 모드 코드를 작성하면, 유지 보수 및 가독성이 떨어집니다. 예를 들면, 쇼핑몰 앱을 만들 때, 카테고리, 구매, 할인, 장바구니 등 기능별로 유의미하게 연관이 있는 `routes`끼리 분리하고, 마지막에 `app.js` 혹은 `index.js` 등과 같은 파일에 합치는 방식을 사용하면 유지 보수 및 가독성을 보장할 수 있습니다. `express.Router()`는 이런 기능별로, 파트 별로 논리적으로 나눠 관리하는 방법을 제공합니다.
- `/product/id`, `/product/search`, `/product/sell`
- `/user/id`, `/user/search`, `/user/sell`
- `/tag/id`, `/tag/search`, `/tag/related`

```javascript
// app.js
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
```

```javascript
// theRouter.js
const express = require("express");
let router = express.Router();

// router.use works the same that app.use does, but it's specific to this router

// instaed of
// app.get(...)
// we do:
// router.get(...)

router.get("/", (req, res, next) => {
  res.json({
    msg: "Router Works!",
  });
});

// router.all
// router.post
// router.delete
// router.put...

module.exports = router;
```
```javascript
// userRouter.js
const express = require("express");
let router = express.Router();

function validateUser(req, res, next) {
  res.locals.validated = true;
  console.log("validated!");
  next();
}

// validateUser, is middleware that will ONLY be added to this router.
// In other words, the main router doesn't know about it.
router.use(validateUser);

router.get("/", (req, res, next) => {
  res.json({
    msg: "User Rourter Works!",
  });
});

module.exports = router;
```