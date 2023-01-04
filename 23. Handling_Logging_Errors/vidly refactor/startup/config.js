const config = require("config");

module.exports = function () {
  // export vidly_jwtPrivateKey=mySecureKey
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined...");
    // process.exit(1);
  }
};
