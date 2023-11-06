const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.write("<h1>Hello World</h1>");
  res.end();
});

server.listen(3000);

// curl -v localhost:3000

var answer = [];
let start = total;

for (let i = 0; i < num; i++) {
  start -= i;
}

start = start / num;

for (let i = start; i < start + num; i++) {
  answer.push(i);
}

return answer;
