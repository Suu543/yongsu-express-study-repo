# Before Express

## Node/HTTP Server 101 (Part1)
```javascript
// node.js native module
const http = require("http");

// http module의 createServer() 메서드를 사용하여 서버를 생성합니다.
// createServer() 메서드의 첫 번째 인자로 콜백함수를 전달합니다.
// takes 1 args:
// 1. callback,
// - 인자로 받는 callback은 두 개의 인자를 받습니다.
// - 첫 번째 인자는 request(요청) 객체, 두 번째 인자는 response(응답) 객체입니다.
// request 축약형 ==> req, response 축약형 ==> res
const server = http.createServer((req, res) => {
  //  res = req(요청)에 대한 응답을 할 때 사용하는 객체입니다.
  //  http message는 다음 순서로 구성됩니다.
  // 1. start-line - HTTP/1.1 200 OK 등의 코드
  // 2. header - 요청에 대한 정보를 포함하는 객체
  //  3. body - 요청에 관한 내용을 포함하는 객체

  // -------------------------------------------
  // res 객체의 writeHead() 메서드를 사용하여 응답의 헤더를 전달합니다, 두 개의 인자를 받습니다.
  // 1. 응답코드(Status Code) - 200, 404, 500 등의 코드
  // 2. MIME type - text/html, text/plain, application/json 등의 MIME type

  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello World</h1>");
  res.end();
});

// createServer() 메서드가 리턴하는 객체에는 서버를 열 때 사용하는 listen() 메서드가 있습니다.
server.listen(3000);

// curl -v localhost:3000
```

## Serving Up Routes and Static Files in Plain Node Part-1 (Part2)
```javascript
// node.js native module
const http = require("http");

// http module의 createServer() 메서드를 사용하여 서버를 생성합니다.
// createServer() 메서드의 첫 번째 인자로 콜백함수를 전달합니다.
// takes 1 args:
// 1. callback,
// - 인자로 받는 callback은 두 개의 인자를 받습니다.
// - 첫 번째 인자는 request(요청) 객체, 두 번째 인자는 response(응답) 객체입니다.
// request 축약형 ==> req, response 축약형 ==> res
const server = http.createServer((req, res) => {
  //  res = req(요청)에 대한 응답을 할 때 사용하는 객체입니다.
  //  http message는 다음 순서로 구성됩니다.
  // 1. start-line - HTTP/1.1 200 OK 등의 코드
  // 2. header - 요청에 대한 정보를 포함하는 객체
  //  3. body - 요청에 관한 내용을 포함하는 객체

  // -------------------------------------------
  // res 객체의 writeHead() 메서드를 사용하여 응답의 헤더를 전달합니다, 두 개의 인자를 받습니다.
  // 1. 응답코드(Status Code) - 200, 404, 500 등의 코드
  // 2. MIME type - text/html, text/plain, application/json 등의 MIME type

  // -------------------------------------------
  // "/" url에 해당하는 리소르를 원하는 경우 다음과 같이 코드를 작성할 수 있습니다.

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.write("<h1>This is the homepage!</h1>");
    res.end();
  } else {
    // "/" url 그 외의 주소로 요청한 경우.
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.write("<h1>404 Not Found</h1>");
    res.end();
  }
});

// createServer() 메서드가 리턴하는 객체에는 서버를 열 때 사용하는 listen() 메서드가 있습니다.
server.listen(3000);

// curl -v localhost:3000
```

## Serving Up Routes and Static Files in Plain Node Part-2 (Part3)
```javascript

```