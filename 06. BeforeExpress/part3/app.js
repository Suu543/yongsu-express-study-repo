const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    res.writeHead(200, { "Content-Type": "text/html" });

    const homePage = fs.readFileSync("./index.html", "utf8");
    console.log(homePage);

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
    res.writeHead(404, {
      "Content-Type": "text/html",
    });
    res.write("<h1>404 Not Found</h1>");
    res.end();
  }
});

server.listen(3000);

// curl -v localhost:3000
