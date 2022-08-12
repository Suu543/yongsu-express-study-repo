# Before Express

## How the Internet Works

인터넷의 사전적 의미는 `interconnected networks of computer) 상호 연결된 컴퓨터 네트워크(집합)` 입니다. 이 중 일부는 웹 서버(Web Server)이며, 웹 서버는 사용자의 요청 사항에 따라 미리 정의해 둔 컨텐츠를 전달하는 `전문 컴퓨터(Specialized Computer)` 역할을 합니다. 서버를 제외한 대부분의 컴퓨터는 노트북, 태블릿 및 스마트폰과 같이 우리가 사용하는 컴퓨터로서 인터넷에 접속하여 사용할 수 있습니다 `(Client Computer)`.

<img src="https://miro.medium.com/max/1400/1*1FPgp4X6xc6uPE1VMx77zg.jpeg" alt="computer" />

웹 서버는 높은 빌딩이고 도로를 통해 연결되었다 가정해보겠습니다. 이러한 도로는 (전 세계의 광섬유의 케이블) 네트워크 혹은 인터넷이고, 이러한 도로를 따라 이동하는 것들을 데이터라 할 수 있습니다. 실제 건물들이 우편 주소를 가지고 있는 것처럼, 각 웹 서버는 `IP Address`라고 불리는 고유한 `주소(Unique Address)`를 가지고 있습니다.

그렇다면 인터넷에 어떻게 연결할 수 있을까요?
현실에서는 `ISP(인터넷 서비스 공급자)`를 통해 인터넷을 공급받습니다. 이는 고객들의 장치를 도로에 연결될 수 있도록 해주는 특별한 건물이라 생각할 수 있습니다. 인터넷에 연결된 각각의 장치들을 `ISP`로 통하는 진입로가 있는 집이라고 생각할 수 있습니다. 

인터넷에 접속하기 위해 사용하는 브라우저를 `클라이언트 애플리케이션(Client Application)`이라고 부릅니다. 이것은 단순히 당신이 다른 웹 사이트에 접속하기 위해 요청을 하고, 그 웹 사이트들이 보낸 데이터에 응답할 수 있게 해주는 프로그램이라는 것을 의미합니다. 이 잘 설명하기 위해 `ESPN.com` 웹 사이트에 요청하기 위한 몇 가지 단계를 나열하겠습니다.

1. 각 웹서버는 고유하게 식별할 수 있는 `IP Address`를 가집니다. 이는 각 건물의 우편 주소로 생각할 수 있습니다. `ESPN`의 경우 `199.181.33.61` IP 주소룰 가지고 있습니다.

2. 브라우저에 `http://espn.go.com`을 입력하면, 브라우저 내부의 로직에 따라 `http://espn.go.com` URL이 `199.181.33.61`를 의미한다는 것을 파악하고, 이를 이용해 ESPN 웹 서버에 요청을 보낼 수 있습니다. `URL`을 통해 `IP Address`를 추출할 때 사용하는 서비스를 `DNS(도메인 네임 서비스)`라고 합니다. `DNS`는 전화번호부로 생각하면 이해가 쉽습니다.

3. `IP Address`가 브라우저에 검색되면, 브라우저는 `소켓(Socket)`을 열어 웹 서버에 연결을 시도합니다. 자세한 내용은 언급하지 않고, 실제로 `높은 빌딩(웹 서버)`에 전화를 걸어 아직 영업 중인지 확인한다고 생각해 보겠습니다. 만약 누군가 응답한다면, 그 회사가 영업 중임을 알게 될 것입니다.

4. 브라우저가 서버가 성공적으로 연결된다면, `ESPN`에 특정 문서를 요청할 수 있습니다. 그러나 요청을 인터넷을 통해 보내려면 서로 약속한 요청 형식을 사용해야 합니다. 이러한 규칙의 집합은 `TCP/IP and HTTP Protocol`이라고 합니다.

5. 인터넷의 도로를 따라 데이터가 이동하기 위해서는, 브라우저에 의해 만들어진 모든 요청과, 웹 서버가 보낸 모든 응답은 먼저 작은 크기로 쪼개져야 합니다. 이를 `데이터 패킷(Data Packet)`이라고 합니다. 사진 한 장을 16 등분 해 한 조각씩 보내 마지막에 합치는 모습을 생각하면 쉽게 이해할 수 있습니다. 데이터에는 이진 데이터(binary data)가 사용될 뿐만 아니라, 각 `조각은(패킷)`은 그것이 도달해야 할 `IP Address`와 모든 패킷이 해당 `IP Address`에 도착했을 때 재조립하는 방법을 알고 있어야 합니다.

6. `ESPN` 사이트에 특정 기사를 요청하는 예시로 돌아가서, 기사에 대한 요청은 패킷(Packet)형태로 쪼개져 도로를 따라 전송됩니다. 그 과정에서 기본적으로 도로 교통정리를 효율적으로 도와주는 `라우터(router)`는 일종의 `트래픽 경찰(Traffic Cops)` 역할을 하며, `각 패킷(Packet)`이 `IP Address` 혹은 올바른 경로로 잘 전달될 수 있도록 안내하는 역할을 합니다.

7. 모든 `데이터 패킷(Data Packet)`이 웹 서버에 도착하면, 웹 서버는 캐비닛 서랍에서 파일을 찾는 것과 유사한 방식으로 특정 문서를 찾습니다. 파일을 찾으면 웹 서버는 다시 패킷으로 잘라서 브라우저로 전달합니다.

8. 마지막으로 `데이터 패킹(Data Packet)`이 브라우저에 다시 도착하면, 브라우저는 모든 패킷을 `HTML, CSS, JavaScript` 및 기사를 나타내는 이미지 파일로 재구성합니다. 그리고 이 파일들이 처리되면, 마치 마법에 걸린 것 처럼 기사 화면을 나타납니다.

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
// node.js native module
const http = require("http");
// 현재 폴더에 있는 파일을 읽어오기 위해 fs 모듈을 사용합니다.
const fs = require("fs");

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
  // -------------------------------------------
  // HTML 파일을 확인해보면 /node.png, styles.css 파일이 있는 것을 볼 수 있습니다.
  // 이 두 파일을 처리하기 위한 별도의 라우터를 작성해야 합니다.

  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const homePage = fs.readFileSync("./index.html", "utf8");
    console.log(homePage); // Buffer 형태로 출력됩니다.

    res.write(homePage);
    res.end();
  } else if (req.url === "/node.png") {
    res.writeHead(200, { "Content-Type": "image/png" });
    const image = fs.readFileSync("node.png");
    res.write(image);
    res.end();
  } else if (req.url === "/styles.css") {
    res.writeHead("200", { "Content-Type": "text/css" });
    const css = fs.readFileSync("styles.css", "utf8");
    res.write(css);
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