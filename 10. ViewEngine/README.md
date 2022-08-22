# View Engine

```javascript
const express = require("express");
const app = express();

// static file (정적 파일) 설정 ==> 폴더 이름은 public
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// 매 요청마다 HTML, CSS, JavaScript 전체를 전달하는 방식 (res.render)
// server side rendering 방식
app.get("/", (req, res, next) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

/*
Error: No default engine was specified and no extension was provided.
...
*/
```
- 오류가 발생한 이유는 어떤 `탬플릿 엔진(Template Engine)`을 사용할 것인지 명시하지 않았기 때문입니다.

```javascript
const path = require("path");
const express = require("express");
const app = express();

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

// res.render
// 첫 번째 인자: 템플릿 파일 이름
// 두 번째 인자: 템플릿 파일에 전달할 데이터
app.get("/", (req, res, next) => {
  res.render("index");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

```javascript
// view/index.ejs - version #1
<% for (let i = 0; i < 10; i++) { %>
    <li>Test</li>
<% } %>

<br />

<% for (let i = 0; i < 10; i++) { %>
    <li>Test</li>
<% } %>

// view/index.ejs - version #2
// index.ejs
<% for (let i=0; i<10; i++) { %>
  <li><%= i %></li>
<% } %>

<br />

<% for (let i=0; i<10; i++) { %>
  <% if (i % 2 === 0) { txt = "even" %>
  <% } else { txt = "odd"} %>
  <li><%= i %> - <%= txt %></li>
<% } %>
```

- 탬플릿 엔진에 데이터를 전달할 때는, `render` 메소드의 두 번째 인자로 객체를 전달합니다.
```javascript
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

// res.render
// 첫 번째 인자: 템플릿 파일 이름
// 두 번째 인자: 템플릿 파일에 전달할 데이터
app.get("/", (req, res, next) => {
  res.render("index", {
    msg: "Success!",
    msg2: "Failure!",
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

- `locals` 프로퍼티를 사용하여 템플릿 엔진에 데이터를 전달할 수 있습니다. `locals`는 생략 가능합니다.
```javascript
<h1>"<%= msg %>"</h1>
<h1>"<%= msg2 %>"</h1>

<br />

<h1><%= locals.msg %></h1>
<h1><%= locals.msg2 %></h1>
```

- res.locals() => 전역 변수 저장소 (res에서 접근 가능)
- res.locals 메소드를 활용해 미들웨어를 생성해보겠습니다.

```javascript
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

// middleware
function validateUser(req, res, next) {
  res.locals.validated = true;
  res.locals.name = "hello";
  res.locals.nickname = "world";
  next();
}

app.use(validateUser);

// res.render
// 첫 번째 인자: 템플릿 파일 이름
// 두 번째 인자: 템플릿 파일에 전달할 데이터는 (res.locals) 붙여집니다.
app.get("/", (req, res, next) => {
  res.render("index", {
    msg: "Success!",
    msg2: "Failure!",
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
```

```javascript
<h1>"<%= msg %>"</h1>
<h1>"<%= msg2 %>"</h1>
<h1>"<%= name %>"</h1>
<h1>"<%= nickname %>"</h1>

<br />

<h1><%= locals.msg %></h1>
<h1><%= locals.msg2 %></h1>
<h1>"<%= locals.name %>"</h1>
<h1>"<%= locals.nickname %>"</h1>
```

- `HTML` 코드를 렌더링 할 때는 `<%->`를 사용합니다.

```javascript
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
```

```javascript
<%- html %>
```

- https://clownhacker.tistory.com/54

```javascript
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
```

- `<%- include("이름"); -%>` 을 사용하여 템플릿 파일을 포함할 수 있습니다.

```html
<!-- index.ejs -->
<%- include("head"); %> <%- include("navbar"); %>

<h1>Home page!</h1>

<!-- about.ejs -->
<%- include("head"); %> <%- include("navbar"); %>

<h1>About page!</h1>
```

```html
<!-- head.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- CSS only -->
    <link
      href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
      rel="stylesheet"
      integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
      crossorigin="anonymous"
    />
    <link rel="stylesheet" type="text/css" href="/css/style.css" />
    <title>Document</title>
  </head>
</html>
```

```html
<!-- navbar.ejs -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <a class="navbar-brand" href="#">Navbar</a>
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarSupportedContent"
      aria-controls="navbarSupportedContent"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Link</a>
        </li>
        <li class="nav-item dropdown">
          <a
            class="nav-link dropdown-toggle"
            href="#"
            id="navbarDropdown"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Dropdown
          </a>
          <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
            <li><a class="dropdown-item" href="#">Action</a></li>
            <li><a class="dropdown-item" href="#">Another action</a></li>
            <li><hr class="dropdown-divider" /></li>
            <li><a class="dropdown-item" href="#">Something else here</a></li>
          </ul>
        </li>
        <li class="nav-item">
          <a class="nav-link disabled">Disabled</a>
        </li>
      </ul>
      <form class="d-flex">
        <input
          class="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
        />
        <button class="btn btn-outline-success" type="submit">Search</button>
      </form>
    </div>
  </div>
</nav>
```

- `ejs` 파일에 주석을 달고 싶은 경우: `<%# %>`

```css
/* public/css/style.css */

/* Custom Stylesheet */
/**
 * Use this file to override Materialize files so you can update
 * the core Materialize files in the future
 *
 * Made By MaterializeCSS.com
 */
.icon-block {
  padding: 0 15px;
}
.icon-block .material-icons {
  font-size: inherit;
}

.toDoDelete {
  margin-top: 1.75em;
  color: #b71c1c;
}

.toDoDelete .material-icons {
  cursor: pointer;
}
```