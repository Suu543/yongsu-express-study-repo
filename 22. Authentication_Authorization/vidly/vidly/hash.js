const bcrypt = require("bcrypt");

// Salt: Random String
// args
// 1. number of string

// 1234 ==> abcd

async function run() {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("1234", salt);
  console.log(salt); // $2b$10$yADq4sMTgk9SlN./ehwmSu
  console.log(hashed);
}

run();
