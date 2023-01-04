# Authentication and Authorization

Authentication(인증): 인증은 사용자가 아이디/이메일/패스워드 등으로 자신의 정보를 증명하는 과정입니다.
Authorization(권한): 권한은 인증된 사용자가 주어진 작업을 수행할 수 있는 권한이 있는지 확인하는 과정입니다.

```javascript
// /api/genres
// /api/movies
// /api/customers
// /api/rentals

// Authentication
// Authorization

// Register: POST /api/users { name, email, password }
// Login: POST /api/logins

email {
    type: String,
    unique: true
}
```

## Creating the User Model

```javascript
// models/user.js
const Joi = require("joi");
const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 255,
      unique: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
  })
);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(genre, schema);
}

exports.User = User;
exports.validate = validateUser;
```

## Registering Users

```javascript
// routes/users.js
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.eamil });
  if (user) return res.status(400).send("User Already Registered...");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  await user.save();

  res.send(user);
});

module.exports = router;
```

## Using Lodash

```bash
npm install lodash
```

```javascript
// routes/users.js
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.eamil });
  if (user) return res.status(400).send("User Already Registered...");

  user = new User(_.pick(req.body, ["name", "email", "password"]));

  await user.save();

  // { name: user.name, email: user.email }
  // = _.pick(user, ["name", "email"]);

  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
```

## Hashing Passwords

데이터베이스에 저장되는 사용자 비밀번호는 평문으로 저장되면 안 되기 때문에, `bcrypt` 모듈을 이용해 `hashed password`를 저장해야 합니다.

```bash
npm install bcrypt
```

```javascript
// hash.js
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
```

- `User` 라우터에 반영

```javascript
// routes/users.js
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.eamil });
  if (user) return res.status(400).send("User Already Registered...");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  // { name: user.name, email: user.email }
  // = _.pick(user, ["name", "email"]);

  res.send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
```

## Authenticating Users

```javascript
// index.js
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const users = require("./routes/users");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const auth = require("./routes/auth");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

```javascript
// routes/auth.js
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.eamil });
  // 사용자에게 비밀번호와 이메일 중 어떤 것이 잘못되었는지 알려주는 것은 좋지 않기 때문에 가능한 일반화된 오류 메시지를 출력해줍니다.
  if (user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  res.send(true);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.email().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return Joi.validate(req);
}

module.exports = router;
```

## JSON Web Tokens

<img src="https://cdn-images-1.medium.com/max/800/1*WClyyxRKyVhxULCVNpOERw.png" />
<img src="https://cdn-images-1.medium.com/max/800/1*PGY-QpvA7ao-NeQMJDQcjA.png" />

`JWT`에는 민감하지 않은 기본 정보를 포함할 수 있습니다. `JWT` 디버깅을 통해 추가 쿼리 없이 사진처럼 `name, admin` 등의 값을 추출할 수 있습니다.

## Generating Authentication Tokens

```bash
npm install jsonwebtoken
```

```javascript
// routes/auth.js
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.eamil });
  // 사용자에게 비밀번호와 이메일 중 어떤 것이 잘못되었는지 알려주는 것은 좋지 않기 때문에 가능한 일반화된 오류 메시지를 출력해줍니다.
  if (user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  // (payload, jwt_secret)
  const token = jwt.sign({ _id: user._id }, "jwtPrivateKey");

  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.email().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return Joi.validate(req);
}

module.exports = router;
```

## Storing Secrets in Environment Variables

```bash
npm install config
```

```javascript
// config/default.json
{
  "jwtPrivateKey": ""
}

// config/custom-environment-variables.json
{
  "jwtPrivateKey": "vidly_jwtPrivateKey"
}
```

```javascript
// routes/auth.js
const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const _ = require("lodash");
const { User } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.eamil });
  // 사용자에게 비밀번호와 이메일 중 어떤 것이 잘못되었는지 알려주는 것은 좋지 않기 때문에 가능한 일반화된 오류 메시지를 출력해줍니다.
  if (user) return res.status(400).send("Invalid email or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid email or password");

  // (payload, jwt_secret)
  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

  res.send(token);
});

function validate(req) {
  const schema = Joi.object({
    email: Joi.email().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return Joi.validate(req);
}

module.exports = router;
```

```javascript
// index.js
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const users = require("./routes/users");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
const auth = require("./routes/auth");
const Fawn = require("fawn");
const express = require("express");
const app = express();

if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined...");
  process.exit(1);
}

mongoose
  .connect("mongodb://127.0.0.1:27017/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

Fawn.init("mongodb://127.0.0.1:27017/vidly");

app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

## Setting Response Headers

```javascript

```

## Encapsulating Logic in Mongoose Models

```javascript
// routes/users.js
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.eamil });
  if (user) return res.status(400).send("User Already Registered...");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  // { name: user.name, email: user.email }
  // = _.pick(user, ["name", "email"]);

  const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

  res
    .header("x-auth-token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = router;
```

## Authorization Middleware

`/routes.users.js`와 `/routes/auth.js` 파일 모두 다음 코드를 반복해서 사용하고 있습니다. 이를 모듈화시켜, 재사용 성을 높여보겠습니다.

```javascript
const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));
```

프로그래밍 경험이 적다면 `generateAuthToken` 등의 함수를 생성해 관리할 것입니다. 하지만 이 방식은 결국에 더 많은 함수 정의가 필요하므로, 이 방식 대신에 데이터베이스를 내부적으로 처리하는 방식을 채택할 수 있습니다.

객체 지향 패턴에서는 `Information Expert Principle`을 적용할 수 있습니다. 식당에서 웨이터는 요리하지 않습니다. 대신에 쉐프가 모든 요리를 합니다. 이처럼 데이터를 저장하고 관리하는 것은 데이터 베이스이기 때문에 모든 권한과 정의를 데이터베이스에 전달하는 게 보다 논리적 코드를 관리할 방법입니다.

이 원칙을 적용하면 코드 형태는 다음과 같이 변할 수 있습니다.

```javascript
// Before
const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

// After
const token = user.generateAuthToken();
```

```javascript
const Joi = require("joi");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
});

// Arrow Function은 this binding되지 않기 때문에 사용하지 않습니다.
userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"));
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(50).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(genre, schema);
}

exports.User = User;
exports.validate = validateUser;
```

```javascript
// routes/users.js and routes/auth.js
// Before
const token = jwt.sign({ _id: user._id }, config.get("jwtPrivateKey"));

// After
const token = user.generateAuthToken();
```

## Authorization Middleware

영화, 대여 등의 기능 구현시 다음과 같이 `res.header("x-auth-token")`에 존재하는 `jwt`를 추출해야 합니다. 하지만 이 과정이 새로운 라우터가 추가될 때마다 반복되어야 하므로, `middleware` 함수로 구현하면, `요청 <=> 응답` 단위로 토큰 진위를 확인할 수 있습니다.

```javascript
const token = req.header("x-auth-token");
// Client doesn't have client credential
res.status(401);
```

미들웨어 정의

```javascript
// middleware/auth.js
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
```

## Protecting Routes

```javascript
// routes/genres.js

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});
```

## Getting the Current User

```javascript
// routes/users.js
const auth = require("../middleware/auth");
const _ = require("lodash");
const { User, validate } = require("../models/user");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const config = require("config");
const jwt = require("jsonwebtoken");
const express = require("express");
const router = express.Router();

router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});
```

## Logging Out Users

데이터베이스에 토큰을 보관하는 것은 보안적으로 좋지 않습니다. 왜냐하면, 해커가 데이터베이스에 접근 가능한 경우 비밀번호를 몰라도 토큰을 이용해 민감한 정보에 접근하는 상황이 발생할 수 있습니다. 마지막으로 클라이언트에게 토큰 전달시 `https` 프로토콜을 이용해 보안 정도를 높이는 것이 중요합니다.

서버에서 로그아웃을 별도로 구현하지 않고, `JWT`의 수명 혹은 `JWT`가 보관된 클라이언트 단에서 `JWT`를 삭제하면 자동으로 로그아웃됩니다.

## Role-based Authorization

```javascript
// middleware/admin.js
module.exports = function (req, res, next) {
  // 401 Unauthorized
  // 403 Forbidden

  if (!req.user.isAdmin) return res.status(403).send("Access Denied...");

  next();
};
```

```javascript
// routes/genres.js
router.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found.");

  res.send(genre);
});
```

## Testing the Authorization

```bash
DELETE http://localhost:3000/api/genres/:genre_id
// Access Denied. No token provided

POST http://localhost:3000/api/auth
{
  "email": "email..",
  "password": "12345"
}

Check JWT using JWT Debugger

// 로그인 후
DELETE http://localhost:3000/api/genres/:genre_id
- Headers: x-auth-token: ...

Access Deniend

// users collection
// isAdmin: true; 설정

POST http://localhost:3000/api/auth
{
  "email": "email..",
  "password": "12345"
}

DELETE http://localhost:3000/api/genres/:genre_id
- Headers: x-auth-token: ...

{
  _id: "",
  name: "",
  __v
}

```

역할을 구분할 수 있는 `roles` 속성과, 장르 삭제 등 어떤 동작에 권한이 있는지 명시할 수 있는 `operations` 속성을 추가했습니다.

```javascript
// models/user.js
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },

  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },

  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },

  isAdmin: Boolean,
  roles: [],
  operations: [],
});
```
