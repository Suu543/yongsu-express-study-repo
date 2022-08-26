## RESTful Routes
서버 동작을 확인하기 위해 두 가지 방법을 사용할 수 있습니다.
1. HTML Form 태그
2. Postman 

### HTML Form
1. form 태그의 action 속성의 서버 주소 값을 작성합니다.
2. form 태그는 `x-www-form-urlencoded` 형식으로 동작합니다.
3. `express` 프레임워크 `express.urlencoded({ extended: true })` 미들웨어는 `x-www-form.urlencoded` 형식으로 전달받은 데이터를 파싱해 `req.body`에 붙여주는 역할을 합니다. 

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8"  />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>GET AND POST REQUESTs</h1>
    <h2>GET</h2>
    <form action="http://localhost:3000/tacos" method="GET">
      <input type="text" name="meat" />
      <input type="number" name="qty" />
      <button>Submit</button>
    </form>

    <h2>POST</h2>
    <form action="http://localhost:3000/tacos" method="POST">
      <input type="text" name="meat" />
      <input type="number" name="qty" />
      <button>Submit</button>
    </form>
  </body>
</html>
```

```javascript
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));

app.get("/tacos", (req, res) => {
  res.send("GET /tacos response");
});

app.post("/tacos", (req, res) => {
  console.log(req.body);
  res.send("POST /tacos response");
});

app.listen(3000, () => {
  console.log("Listening on port 3000!");
});
```


### Postman
`postman`은 `HTML` 없이 여러 종류의 데이터 타입을 테스트하게 해주는 도구입니다.
1. 서버 주소를 입력합니다.
2. 서버가 이해할 수 있는 데이터 형식을 설정하고, 데이터를 구성합니다.

## REST
<img src="https://cdn-images-1.medium.com/max/1000/0*wM0Q8jTMzTELovIE.png" />

REST: Representational State Transfer의 약자입니다.
- 자원을 이름(자원으 표현)으로 구분하여 해당 자원의 정보를 주고 받는 모든 행위를 의미합니다.
- 자원(resource) ==> 표현(representation)에 의한 상태 전달
    
    a. 자원의 표현 (The representation of resources)
    - 자원: 해당 소프트웨어가 관리하는 모든 것
    - Ex) 문서, 그림, 데이터, 해당 소프트웨어 등
    - 자원의 표현: 그 자원을 표현하기 위한 이름
    - Ex) DB의 학생 정보가 자원일 때, `Students`를 자원의 표현으로 정의함

    b. 정보 전달
    - 데이터가 요청되어지는 시점에 자원의 정보를 전달합니다.
    - `JSON`, `XML`,`urlencoded` 등을 통해 데이터를 주고 받는 것이 일반적입니다.
- WWW(World Wide Web)을 기반으로 하는 웹개발 등을 위한 소프트웨어 개발 아키텍처의 한 형식입니다.
  - `REST`는 기본적으로 웹의 기존 기술과 `HTTP` 프로토콜을 그대로 활용하기 때문에 `웹의 장점을 최대한 활용할 수 있는 아키텍처 스타일입니다`.

REST의 구체적인 개념
- `HTTP URI(Uniform Resource Identifier)`를 통해 `자원(Resource)`을 주고 받고, `HTTP Method(POST, GET, PUT, DELETE, PATCH)`를 통해 해단 자원에 대한 `CRUD Operation(생성, 읽기, 갱신, 삭제)`를 적용하는 것을 의미합니다.
  - `REST`는 `자원 기반의 구조(ROA, Resource Oriented Architecture) 설계`의 중심에 `자원(Resource)`이 있고 `HTTP Method`를 통해 자원을 처리하도록 설계된 아키텍쳐를 의미합니다.
  - 웹 사이트의 이미지, 텍스트, DB 내용 등의 모든 자원에 고유한 `식별값(ID)`인 `HTTP URI`를 부여합니다.
  - CRUD Operation
    - Create: 생성(POST)
    - Read: 조회(GET)
    - Update: 수정(PUT)
    - Delete: 삭제(DELETE)
    - HEAD: HTTP Header 정보 조회(Head)

REST의 장단점
- 장점:
  - `HTTP` 프로토콜의 인프라를 그대로 사용하므로 `REST API` 사용을 위한 별도의 인프라를 구축 할 필요가 없습니다.
  - `HTTP` 프로토콜의 표준을 최대한 활용하여 여러 추가적인 장점을 함께 가져갈 수 있습니다.
  - `HTTP` 표준 프로토콜을 따르는 모든 플랫폼에서 사용 가능합니다.
  - `Hypermedia API`의 기본을 충실히 지키기 때문에 범용성을 보장할 수 있습니다.
  - `REST API` 메세지가 의도하는 바를 명확하게 나타내므로 의도하는 바를 쉽게 파악할 수 있습니다.
  - 여러가지 서비스 디자인에서 생길 수 있는 문제를 최소화합니다.
  - 서버와 클라이언트 역할을 명확하게 구분합니다.

- 단점:
  - 표준이 존재하지 않습니다.
  - 사용할 수 있는 메소드가 4가지 밖에 없습니다(HTTP Method).

REST 구성요소
1. 자원(Resource): URI
- 모든 자원에 고유한 `ID`가 존재하고, 이 자원은 서버에 존재합니다.
- 자원을 구분하는 `ID`는 `/student/:student_id`와 같은 `HTTP URI` 형태 입니다.
- 클라이언트는 `URI`를 이용해 자원을 지정하고, 해당 자원에 대한 일렬의 조작을 서버에 요청합니다.

2. 행위(Verb): HTTP Method
- `HTTP` 프로토콜의 메소드를 사용합니다.
- `HTTP` 프로토콜은 `GET, POST, PUT, DELETE, PATCH`와 같은 메소드를 제공합니다.

3. 표현(Representation of Resource)
- 클라이언트가 자원에 대한 조작을 요청하면 서버는 이에 적절한 응답(Representation)을 보냅니다.
- `REST`에서 하나의 자원은 `JSON, XML, TEXT, RSS`등 여러 형태의 응답(Representation)으로 나타내어 질 수 있습니다.
- `JSON` 혹은 `XML`을 통해 데이털르 주고 받는 것이 일반적입니다.


REST 특징
1. Server - Client(서버-클라이언트 구조)
- 자원을 관리하고 통제하는 쪽: Server
- 자원을 요청하는 쪽: Client
    - `REST Server`: API를 제공하고 비즈니스 로직 처리 및 저장을 담당합니다.
    - `Client`: 사용자 인증, 컨텍스트(세션, 로그인 정보) 등을 직접 관리하고 책임집니다.

2. Stateless(무상태)
- `HTTP` 프로토콜은 `Stateless` 프로토콜이기 때문에 이를 기반에 둔 `REST` 역시 `Stateless` 방식으로 동작합니다.
- `Client`의 컨텍스트를 서버에 저장하지 않습니다.
  - 컨텍스트를 저장은 쿠키, 세션 등이 담당합니다.
- 서버는 각각의 요청을 완전히 별개의 것으로 인식하고 처리합니다.
  - 각 API 서버는 단순히 클라이어너트 요청을 처리합니다.
  - 이전 요청이 다음 요청의 처리에 연관되어서는 안됩니다.
    - DB CRUD Operation과는 별개로 생각해야합니다
  - 서버의 처리방식에 일관성을 부여하기 때문에, 서비스의 자유도가 높아집니다.

3. Cacheable(캐시 처리 기능)
- 웹 표준 `HTTP` 프로토콜을 그대로 사용하기 때문에 웹에서 사용하는 기존의 인프라를 그대로 활용할 수 있습니다 
  - `HTTP`가 가진 특징 중 캐싱 기능을 활용할 수 있습니다.
  - `HTTP` 프로토콜 표준에서 사용하는 `Last-Modified` 혹은 `E-Tag`를 이용해 캐싱 구현이 가능합니다.
  - 대량의 요청을 효율적으로 처리하기 위해 캐시가 요구됩니다.
  - 캐시 사용을 통해 응답시간이 빨라지고 `REST Server` 트랜잭션이 발생하지 않기 때문에 전체 응답시간, 성능, 서버의 자원 이용률을 향상시킬 수 있습니다.

4. Layered System(계층화)
- 클라이언트는 `REST API Server`만을 호출합니다.
- `REST SErver`는 다중 계층으로 구성될 수 있습니다.
  - `API Server`는 순수 비즈니스 로직을 수행하고 그 앞단에 보안, 로드밸런싱, 암호화, 사용자 인증 등을 추가하여 구조상의 유연성을 부여할 수 있습니다.
  - 로드밸런싱, 캐시 등을 통해 확장성과 보안성을 향상시킬 수 있습니다.
  - 프록시, 게이트웨이 같은 네트워크 기반의 중간 매체를 사용할 수 있습니다.

5. Code-On-Demand
- 서버로부터 스크립트를 받아 클라이언트에서 실행합니다.
- 반드시 충족할 필요는 없습니다.

6. Uniform Interface(인터페이스 일관성)
- `URI`로 지정한 자원에 대한 조작을 통일되고 한정적인 인터페이스로 수행합니다.
- `HTTP` 표준 프로토콜에 따라는 모든 플랫폼에서 사용 할 수 있습니다
  - 특정 언어나 기술에 종속되지 않습니다.

<img src="https://cdn-images-1.medium.com/max/1000/0*FbN539rH_C5hwCDc.png" />

REST API
- API(Application Programming Interface)
  - 데이터와 기능의 집합을 제공하여 컴퓨터 프로그램간 상호작용을 촉진하며, 서로 정보를 교환할 수 있도록 하는 것.
- REST API
  - `REST` 기반으로 서비스 API를 구현하는 것
  - 최근 `OpenAPI(누구나 사용할 수 있도록 공개된 API: 구글 맵, 공공 데이터 등)`, 마이크로 서비스(하나의 큰 애플리케이션을 여러 개의 작은 애플리케이션으로 쪼개어 변경과 조합이 가능하도록 만든 아키텍처)를 제공하는 회사 대부분은 REST API를 제공합니다.

REST API 특징
- `REST` 기반으로 시스템을 분산해 확장성과 재사용성을 높여 유지보수 및 운용을 편리하게 할 수 있습니다.
- `REST`는 `HTTP` 표준을 기반으로 구현하므로, `HTTP`를 지원하는 프로그래밍 언어로 클라이언트, 서버를 구현할 수 있습니다.

REST API 설계 규칙
- 참고 리소스 원형
    - Document: 객체 인스턴스나 데이터베이스 레코드와 유사한 개념
    - Collection: 서버에서 관리하는 디렉토리라는 리소스
    - Store: 클라이언트에서 관리하는 리소스 저장소

1. `URI`는 정보의 자원을 표현해야 합니다.
   1. 자원은 동사보다 명사를, 대문자보다 소문자를 사용합니다
   2. 자원의 `document` 이름으로는 단수 명사를 사용합니다.
   3. 자원의 `collection` 이름으로는 복수 명사를 사용합니다.
   4. 자원의 `store` 이름으로는 복수 명사를 사용합니다.
    - Ex) `GET /Member/1` => `GET /member/1`

2. 자원에 대한 행위는 `HTTP Method (GET, PUT, POST, DELETE, PATCH)`로 표현합니다.
    1. `URI`에 `HTTP Method`가 들어가면 안됩니다.
   - Ex) `GET /members/delete/1` => `DELETE /members/1`

    2. `URI`에 행위에 대한 동사 표현이 들어가면 안됩니다. (`CRUD` 기능을 나타내는 동사 표현을 `URI`에 사용하지 않습니다.)
    - Ex) `GET /members/show/1` => `GET /members/1`
    - Ex) `GET /members/insert/2` => `POST /members/2`

    3. 경로 부분 중 변하는 부분은 유일한 값으로 대체합니다. (`:id`는 하나의 특정 자원을 나타내는 고유값입니다.)
    - Ex) `student`를 생성시: `route: POST /students`
    - Ex) `id=12`인 `student`를 삭제하는 경우: `route: DELETE/students/12`

REST API 설계 규칙
1. `슬래시 구분자(/)`는 계층 관계를 나타내는 데 사용합니다.
    - Ex) `http://restapi.example.com/houses/apartments`
2. `URI` 마지막 문자로 `슬래시 구분자(/)`를 포함하지 않는다.
    - `URI`에 포함되는 모든 글자는 자원의 유일한 식별자로 사용되어야 하며 `URI`가 다르다는 것은 다른 자원임을 의미하고, 역으로 자원이 다르면 `URI`도 달라져야 합니다.
    - `REST API`는 분명한 `URI`를 만들어 통신 해야 하기 때문에 혼동을 주지 않도록 `URI` 경로의 마지막에는 `슬래시 구분자(/)`를 사용하지 않습니다.
    - Ex) `http://restapi.example.com/houses/apartments/ (x)`
3. `하이픈(-)`은 `URI` 가독성을 높이는 데 사용합니다.
    - 불가피하게 긴 `URI` 경로를 사용하게 된다면 `하이픈(-)`을 사용해 가독성을 높입니다.
4. `언더스코어(_)`는 `URI`에 사용하지 않습니다.
    - 밑줄은 보기 어렵기 때문에 밑줄 때문에 문자가 가려짐으로 가독성을 위해 밑줄은 사용하지 않습니다.
5. `URI` 경로에는 소문자가 적합합니다.
    - `URI` 경로에 대문자 사용은 가능한 피합니다.
    - `RFC 3986(URI 문법 형식)`은 `URI` 스키미와 호스트를 제외하고는 대소문자를 구별하도록 규정하기 때문입니다.
6. 파일확장자는 `URI`에 포함하지 않습니다.
    - `REST API`에서는 메세지 바디의 포맷을 나타내기 위해 파일 확장자를 `URI`에 포함시키지 않습니다.
    - `Accept Header`를 사용합니다
    - Ex) `http://restapi.example.com/members/student/345/photo.jpg (x)`
    - Ex) `GET / members/student/345/photo HTTP/1.1 Host: restapi.example.com, Accept: image/jpg (o)`
7. 자원 간에 연관성이 존재하는 경우
    - `/자원/자원ID/관계가 있는 다른 자원명`
    - Ex) `GET : /users/{userid}/devices`

<img src="https://cdn-images-1.medium.com/max/1000/0*XrvN6sI0lfSRk3Ym.png" />

HTTP Status Code:
- 1xx : 전송 프로토콜 수준의 정보 교환
- 2xx : 클라어인트 요청이 성공적으로 수행됨
- 3xx : 클라이언트는 요청을 완료하기 위해 추가적인 행동을 취해야 함
- 4xx : 클라이언트의 잘못된 요청
- 5xx : 서버쪽 오류로 인한 상태코드

<img src="https://cdn-images-1.medium.com/max/1000/0*8ahdeoGjymtczbiC.png" />

RESTful이란?
- `RESTful`은 일반적으로 `REST`라는 아키텍처를 구현하는 웹 서비스를 나타내기 위해 사용되는 용어입니다.
  - `REST API`를 제공하는 웹 서비스를 `RESTful`하다고 할 수 있습니다.
- `RESTful`은 `REST`를 `REST` 답게 쓰기 위한 방법론으로, 공식적으로 발표한 것이 아닌, `REST` 방식의 아키텍쳐를 가진 서비스를 표현하는 용어로 사용됩니다.


RESTful의 목적
- 이해하기 쉽고 사용하기 쉬운 `REST API`를 만드는 것
- `RESTful`한 `API`를 구현하는 근본적인 목적이 성능 향상이 아닌, 일관적인 컨벤션을 통한 `API`의 이해도 및 호환성을 높이는 것이 주 목적이기 때문에, 성능이 중요한 상황에서는 굳이 `RESTful`한 `API`를 구현할 필요는 없습니다.

RESTful 하지 못한 경우
- Ex) `CRUD` 기능을 모두 `POST` 처리하는 API
- Ex) `route`에 `resource, id` 외의 정보가 들어가는 경우(`/students/updateName)`

## RESTful Comments
code: part2
```javascript
Index   - GET    /comments           - 모든 comments 읽기
New     - GET    /comments/new       - 새로운 comment 생성 Form 렌더링
Create  - POST   /comments           - 새로운 comment 생성
Show    - GET    /comments/:id       - 특정 comment 읽기
Edit    - GET    /comments/:id/edit  - 특정 comment 수정 Form 렌더링
Update  - PATCH  /comments/:id       - 특정 comment 수정
Destroy - Delete /comments/:id       - 특정 comment 삭제
```

```javascript
// app.js
const path = require("path");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const comments = [
  {
    username: "First",
    comment: "This is first",
  },
  {
    username: "Second",
    comment: "This is Second",
  },
  {
    username: "Third",
    comment: "This is Third",
  },
  {
    username: "Fourth",
    comment: "This is Fourth",
  },
  {
    username: "Fifth",
    comment: "This is Fifth",
  },
  {
    username: "Sixth",
    comment: "This is Sixth",
  },
];

app.get("/comments", (req, res, next) => {
  res.render("comments/index", { comments });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
```

```javascript
// views/comments/index.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Comments Index</title>
  </head>
  <body>
    <h1>Comments</h1>
    <ul>
      <% for(let c of comments) { %>
      <li><%= c.comment %> - <b> <%= c.username %> </b></li>
      <%}%>
    </ul>
  </body>
</html>
```

## RESTful Comments New
Code: part3
```javascript
const path = require("path");
const express = require("express");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

const comments = [
  {
    username: "First",
    comment: "This is first",
  },
  {
    username: "Second",
    comment: "This is Second",
  },
  {
    username: "Third",
    comment: "This is Third",
  },
  {
    username: "Fourth",
    comment: "This is Fourth",
  },
  {
    username: "Fifth",
    comment: "This is Fifth",
  },
  {
    username: "Sixth",
    comment: "This is Sixth",
  },
];

app.get("/comments", (req, res, next) => {
  res.render("comments/index", { comments });
});

app.get("/comments/new", (req, res, next) => {
  res.render("comments/new");
});

app.post("/comments", (req, res, next) => {
  const { username, comment } = req.body;
  comments.push({ username, comment });
  res.send("It worked!");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
```

1. `GET /comments/new`를 통해 `comment` `생성 Form(형식)` 렌더링
2. `POST /comments`를 통해 `comment` 생성
3. `GET /comments` 추가된 `comment` 확인

```javascript
// index.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Comments Index</title>
  </head>
  <body>
    <h1>Comments</h1>
    <ul>
      <% for(let c of comments) { %>
      <li><%= c.comment %> - <b> <%= c.username %> </b></li>
      <%}%>
    </ul>

    <a href="/comments/new">New Comment</a>
  </body>
</html>

// new.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Document</title>
  </head>
  <body>
    <h1>Make a new comment</h1>
    <form action="/comments" method="POST">
      <section>
        <label for="username">Enter Username:</label>
        <input type="text" placeholder="username" name="username" />
      </section>
      <section>
        <label for="comment"></label>
        <br />
        <textarea name="comment" id="comment" cols="30" rows="10"></textarea>
      </section>
      <button>Submit</button>
    </form>

    <a href="/comments">Back to Index</a>
  </body>
</html>
```

- `comment` 생성 후 `/comments` url로 리다이렉션 코드를 추가해보겠습니다.
```javascript
app.post("/comments", (req, res, next) => {
  const { username, comment } = req.body;
  comments.push({ username, comment });
  //   res.send("It worked!");
  res.redirect("/comments");
});
```

1. 새로운 `comment`를 제출합니다.
2. `comments` 배열에 새로운 `comment`를 추가합니다.
3. `/comments` 주소로 리다이렉션이 발생합니다. 
- 이때 302 코드와 함께, `/comments`에 요청을 보내는 방식을 동작하기 때문에 새로운 `comment`가 반영된 것을 확인할 수 있습니다.

## Comments Show
Code: Part4 `/comments/:id`

```javascript
// app.js
app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === parseInt(id));
  console.log("commment", comment);
  res.render("comments/show", { comment });
});
```

```javascript
// show.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Show</title>
  </head>
  <body>
    <h1>Comment ID:</h1>
    <h2><%= comment.comment %> - <%=comment.username %></h2>
    <a href="/comments">Back to Index</a>
  </body>
</html>

// index.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Comments Index</title>
  </head>
  <body>
    <h1>Comments</h1>
    <ul>
      <% for(let c of comments) { %>
      <li>
        <%= c.comment %> - <b> <%= c.username %> </b>
        <a href="/comments/<%= c.id %>">Detail</a>
      </li>
      <%}%>
    </ul>

    <a href="/comments/new">New Comment</a>
  </body>
</html>
```

## The UUID Package
Code: part4
- https://www.npmjs.com/package/uuid
`comment`를 생성할 때마다, `id`를 1씩 증가시키는 방식을 사용해도 되지만, 이런 값보다는 고유한 암호 형태의 값을 사용하는 것이 좋습니다. 이 경우 `UUID`라는 패키지를 활용하면 손쉽게 고유한 암호 형태의 `id`값을 생성할 수 있습니다.

```javascript
const morgan = require("morgan");
const path = require("path");
const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(morgan("dev"));

const comments = [
  {
    id: uuid(),
    username: "First",
    comment: "This is first",
  },
  {
    id: uuid(),
    username: "Second",
    comment: "This is Second",
  },
  {
    id: uuid(),
    username: "Third",
    comment: "This is Third",
  },
  {
    id: uuid(),
    username: "Fourth",
    comment: "This is Fourth",
  },
  {
    id: uuid(),
    username: "Fifth",
    comment: "This is Fifth",
  },
  {
    id: uuid(),
    username: "Sixth",
    comment: "This is Sixth",
  },
];

app.get("/comments", (req, res, next) => {
  res.render("comments/index", { comments });
});

app.get("/comments/new", (req, res, next) => {
  res.render("comments/new");
});

app.post("/comments", (req, res, next) => {
  const { username, comment } = req.body;
  comments.push({ username, comment, id: uuid() });
  //   res.send("It worked!");
  res.redirect("/comments");
});

app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  console.log("commment", comment);
  res.render("comments/show", { comment });
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
```

## Comments Update
Code: part5 `GET /comments/:id/edit ==> PATCH /comments/:id`
- PUT: 전체를 갱신하는 개념
- PATCH: 특정 부분만 갱신하는 개념

- 테스트는 `postman`으로 진행했습니다.
```javascript
app.patch("/comments/:id", (req, res) => {
  const { id } = req.params;
  const newCommentText = req.body.comment;
  const foundComment = comments.find((c) => c.id === id);
  foundComment.comment = newCommentText;
  res.redirect("/comments");
});
```

## Express Method Override
Code: part6 `Edit /comments/:id/edit GET`
`HTML Form`과 브라우저는 `GET` or `POST` 요청만 보낼 수 있습니다. `PUT`, `PATCH`, or `DELETE` 요청을 보낼 수 없습니다. 이 `Method Override` 방식으로 이 문제를 해결할 수 있습니다.
- http://expressjs.com/en/resources/middleware/method-override.html

1. `POST` 방식으로 `HTML FORM` 태그에서 요청을 보냅니다.
2. 이때 `action` 속성에 `url`을 명시할 때, `query-string` 방식으로 `_method` 키에 `GET` or `POST`가 아닌 다른 메소드를 명시하고, 요청은 `POST` 이지만 `express` 서버의 `method override` 미들웨어에 의해 `POST` ==> `PATCH or DELETE`로 인식하고, 이에 해당한 라우터를 실행하는 방식으로 동작합니다.

```javascript
const morgan = require("morgan");
const path = require("path");
const methodOverride = require("method-override");
const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(morgan("dev"));

const comments = [
  {
    id: uuid(),
    username: "First",
    comment: "This is first",
  },
  {
    id: uuid(),
    username: "Second",
    comment: "This is Second",
  },
  {
    id: uuid(),
    username: "Third",
    comment: "This is Third",
  },
  {
    id: uuid(),
    username: "Fourth",
    comment: "This is Fourth",
  },
  {
    id: uuid(),
    username: "Fifth",
    comment: "This is Fifth",
  },
  {
    id: uuid(),
    username: "Sixth",
    comment: "This is Sixth",
  },
];

app.get("/comments", (req, res, next) => {
  res.render("comments/index", { comments });
});

app.get("/comments/new", (req, res, next) => {
  res.render("comments/new");
});

app.post("/comments", (req, res, next) => {
  const { username, comment } = req.body;
  comments.push({ username, comment, id: uuid() });
  //   res.send("It worked!");
  res.redirect("/comments");
});

app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  console.log("commment", comment);
  res.render("comments/show", { comment });
});

// GET /comments/:id/edit ==> PATCH /comments/:id
app.get("/comments/:id/edit", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  res.render("comments/edit", { comment });
});

app.patch("/comments/:id", (req, res) => {
  const { id } = req.params;
  const newCommentText = req.body.comment;
  const foundComment = comments.find((c) => c.id === id);
  foundComment.comment = newCommentText;
  res.redirect("/comments");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
```

```javascript
// edit.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Edit</title>
  </head>
  <body>
    <h1>Edit</h1>
    <!-- Pretending -->
    <form method="POST" action="/comments/<%=comment.id%>?_method=PATCH">
      <textarea name="comment" id="" cols="30" rows="10">
        <%= comment.comment %>
    </textarea
      >
      <button>Save</button>
    </form>
  </body>
</html>

// show.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Show</title>
  </head>
  <body>
    <h1>Comment ID:</h1>
    <h2><%= comment.comment %> - <%=comment.username %></h2>
    <a href="/comments">Back to Index</a>
    <a href="/comments/<%= comment.id %>/edit">Edit Comment</a>
  </body>
</html>
```

References:
- https://gmlwjd9405.github.io/2018/09/21/rest-and-restful.html
- https://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm

## Comment Delete
Code: part7 `DELETE /comment/:id`

`comment`를 삭제하는 경우 `HTTP Method: DELETE`를 사용해야 하는 데, `HTML Form`에서는 사용할 수 없으므로, `Method Override` 방식을 활용할 수 있습니다.

```javascript
const morgan = require("morgan");
const path = require("path");
const methodOverride = require("method-override");
const express = require("express");
const { v4: uuid } = require("uuid");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(morgan("dev"));

let comments = [
  {
    id: uuid(),
    username: "First",
    comment: "This is first",
  },
  {
    id: uuid(),
    username: "Second",
    comment: "This is Second",
  },
  {
    id: uuid(),
    username: "Third",
    comment: "This is Third",
  },
  {
    id: uuid(),
    username: "Fourth",
    comment: "This is Fourth",
  },
  {
    id: uuid(),
    username: "Fifth",
    comment: "This is Fifth",
  },
  {
    id: uuid(),
    username: "Sixth",
    comment: "This is Sixth",
  },
];

app.get("/comments", (req, res, next) => {
  res.render("comments/index", { comments });
});

app.get("/comments/new", (req, res, next) => {
  res.render("comments/new");
});

app.post("/comments", (req, res, next) => {
  const { username, comment } = req.body;
  comments.push({ username, comment, id: uuid() });
  //   res.send("It worked!");
  res.redirect("/comments");
});

app.get("/comments/:id", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  console.log("commment", comment);
  res.render("comments/show", { comment });
});

// GET /comments/:id/edit ==> PATCH /comments/:id
app.get("/comments/:id/edit", (req, res) => {
  const { id } = req.params;
  const comment = comments.find((c) => c.id === id);
  res.render("comments/edit", { comment });
});

app.patch("/comments/:id", (req, res) => {
  const { id } = req.params;
  const newCommentText = req.body.comment;
  const foundComment = comments.find((c) => c.id === id);
  foundComment.comment = newCommentText;
  res.redirect("/comments");
});

app.delete("/comments/:id", (req, res) => {
  const { id } = req.params;
  // const ==> let
  comments = comments.filter((c) => c.id !== id);
  res.redirect("/comments");
});

app.listen(3000, () => {
  console.log("listening on port 3000");
});
```

```javascript
// show.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Show</title>
  </head>
  <body>
    <h1>Comment ID:</h1>
    <h2><%= comment.comment %> - <%=comment.username %></h2>
    <a href="/comments">Back to Index</a>
    <a href="/comments/<%= comment.id %>/edit">Edit Comment</a>

    <form method="POST" action="/comments/<%= comment.id %>?_method=DELETE">
      <button type="submit">Delete</button>
    </form>
  </body>
</html>
```