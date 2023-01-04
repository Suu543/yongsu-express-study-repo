const jwt = require("jsonwebtoken");
const config = require("config");

function auth(req, res, next) {
  const token = req.header("x-auth-token");
  // Client doesn't have client credential
  if (!token) return res.status(401).send("Access denied. No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    // users model에서 jwt를 생성할 때 사용한 payload 값을 req.user에 붙여줍니다.
    req.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid Token...");
  }
}

module.exports = auth;
