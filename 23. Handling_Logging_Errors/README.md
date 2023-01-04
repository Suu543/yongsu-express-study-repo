# Handling and Logging Errors

1. 정확하고 서버 내부 로직을 드러내지 않는 일반화된 오류 메시지를 전달합니다.
2. 예외 처리를 확실하게 해서, 예상치 못한 오류에 대처합니다.

`MongoDB Shell`을 종료하고 데이터베이스 반영 로직을 실행하면 `Promise Rejection` 오류가 출력됩니다.

<img src="https://cdn-images-1.medium.com/max/800/1*lfx0bWGlqmmQo0_94G_rcA.png" />

## Handling Rejected Promises

다음 `url`에 해당하는 라우터 로직에는 예외처리 로직이 정의되지 않았기 때문에, 요청 및 응답이 정상적으로 이뤄지지 않습니다.

```bash
GET http://localhost:3000/api/genre
```

```javascript
// routes/genres.js
router.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});
```

위 라우터 로직에 예외처리 로직을 추가해보겠습니다.

```javascript
// routes.genres.js

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (ex) {
    // Log the exception
    res.status(500).send("Something Failed");
  }
});
```

## Express Error Middleware

다음과 같이 예외 처리를 했을 때, 오류 메시지를 변경하는 상황이 발생했을 때, 일일이 라우터를 확인해야 한다는 번거로움이 있습니다. `Express Error Middleware`를 통해 이 번거로움을 해결할 수 있습니다.

```javascript
// routes/genres.js

router.get("/", async (req, res) => {
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (ex) {
    // Log the exception
    res.status(500).send("Something Failed");
  }
});
```

`Express` 프레임워크에는 `Express Error Middleware`가 존재합니다. 모든 미들웨어의 호출이 끝난 후 마지막으로 호출되는 미들웨어를 `Express Error Middleware`로 정의할 수 있습니다. 왜냐하면 예상치 못한 오류 및 예외를 처리하기 위한 목적이 있기 때문에 마지막 미들웨어로 `Express Error Middleware`를 정의합니다.

```javascript
// index.js
// ...
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

// Express Error Middleware
app.use(function (err, req, res, next) {
  // res.status(500).send("Something Failed");
  res.status(500).send(err);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

```javascript
// routes/genres.js

router.get("/", async (req, res, next) => {
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (ex) {
    // Log the exception
    next(ex);
  }
});
```

`Express Error Middleware` 로직을 추출해 별도의 미들웨어 모듈로 정의하겠습니다.

```javascript
// middleware/error.js
module.exports = function (err, req, res, next) {
  // res.status(500).send("Something Failed");
  res.status(500).send(err);
};
```

```javascript
// index.js
// ...
const error = require("./middleware/error");

// ...
app.use(express.json());
app.use("/api/genres", genres);
app.use("/api/customers", customers);
app.use("/api/movies", movies);
app.use("/api/rentals", rentals);
app.use("/api/users", users);
app.use("/api/auth", auth);

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

## Removing Try Catch Blocks

다음과 같이 데이터베이스에 접근해 데이터를 읽어오는 로직에 `try ~ catch` 패턴이 반복되는 것을 확인할 수 있습니다. `try ~ catch` 구문을 함수로 만들어 코드를 재사용도를 높여보겠습니다.

```javascript
// routes/genres.js

router.get("/", async (req, res, next) => {
  try {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  } catch (ex) {
    // Log the exception
    next(ex);
  }
});
```

`asyncMiddleware` 함수를 정의해 코드 재사용도를 높였습니다. 하지만 문제는 지금 방식으로는 미들웨어가 `handler` 함수의 `req, res, next` 인자에 접근할 수 없다는 점입니다.

```javascript
// routes/genres.js
async function asyncMiddleware(handler) {
  try {
    // ..
    await handler(req, res);
  } catch (ex) {
    next(ex);
  }
}

router.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);
```

`Express`가 모든 미들웨어에 `req, res, next`를 전달한다는 점을 이용해 이 문제를 해결해 보겠습니다.

```javascript
// routes/genres.js
function asyncMiddleware(handler) {
  // Express Standard Route Handler
  return async (req, res, next) => {
    try {
      // ..
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
}

router.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);
```

`asyncMiddleware` 로직을 추출해 별도의 미들웨어 모듈로 정의하겠습니다.

```javascript
// middleware/async.js
module.exports = function asyncMiddleware(handler) {
  return async (req, res, next) => {
    try {
      // ..
      await handler(req, res);
    } catch (ex) {
      next(ex);
    }
  };
};
```

```javascript
// routes/genres.js
// ...
const asyncMiddleware = require("../middleware/async");

// ...
router.get(
  "/",
  asyncMiddleware(async (req, res, next) => {
    const genres = await Genre.find().sort("name");
    res.send(genres);
  })
);

router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let genre = new Genre({ name: req.body.name });
    genre = await genre.save();

    res.send(genre);
  })
);
```

## Express Async Errors

`asyncMiddleware` 방식이 코드 재사용성을 높였음에도, 여전히 매번 모듈을 불러와 적용해야 한다는 번거로움이 존재합니다. `express-async-errors` 모듈을 이용해 이 문제를 해결해보겠습니다.

```bash
npm install express-async-errors
```

```javascript
// index.js
// 최상단
require("express-async-errors");
```

```javascript
// routes/genres.js
router.get("/", async (req, res, next) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();

  res.send(genre);
});
```

`express-async-errors` 모듈을 호출함으로써 `asyncMiddlware` 미들웨어를 추가한 것과 같이 동작합니다. 그럼에도 제대로 동작하지 않는다면, 앞서 정의한 `asyncMiddleware`를 추가해야 합니다.

## Logging Errors

소프트웨어 개발을 하는 중에는 로그를 직접 확인할 수 있지만, 배포 혹은 자리를 비웠을 때는 그렇지 않습니다. 24시간 컴퓨터 앞에 앉아 있을 수 없기 때문에 언제 어디서 오류가 발생하는지 확인할 수 없습니다. `winston` 이와 같은 로그를 체계적으로, 24시간 기록할 수 있게 도와주는 모듈입니다.

<img src="https://cdn-images-1.medium.com/max/800/1*nBHVZzo3HpoJuSJkvZQDMg.png" />

```bash
npm install winston
```

```bash
# Loggin Level
error: 0
warn: 1
info: 2
verbose: 3
debug: 4
silly: 5
```

```javascript
// index.js
// ...
const winston = require("winston");

// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });

// ...
```

```javascript
// routes/genres.js
router.get("/", async (req, res, next) => {
  // winston test
  throw new Error("Could not get the genres...");
  const genres = await Genre.find().sort("name");
  res.send(genres);
});
```

```javascript
// middleware/error.js
const winston = require("winston");

module.exports = function (err, req, res, next) {
  //   winston.log("error: ", err.message);
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  // res.status(500).send("Something Failed");
  res.status(500).send(err);
};
```

`logfile.log` 확인

## Logging to MongoDB

`MongoDB` 동작에 관련된 로그를 찍고 싶은 경우 `winston-mongodb` 모듈을 이용할 수 있습니다.

```bash
npm install winston-mongodb
```

```javascript
// index.js
// ...
const winston = require("winston");
require("winston-mongodb");
// ...

winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});
// ...
```

`Mongo Cluster`에 들어가면 `log` 컬렉션이 생성되고, 내부에 오류가 기록되는 것을 확인할 수 있습니다.

```javascript
// index.js
// index.js
// ...
const winston = require("winston");
require("winston-mongodb");
// ...

winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
  level: "info",
});
// ...
```

`level` 속성을 추가하면 다음 순서 전에 해당하는 모든 동작이 기록됩니다.
Ex) `level: info`를 설정한 경우 `warn` and `error`에 해당하는 모든 동작이 기록됩니다.

```bash
1. error
2. warn
3. info
4. verbose
5. debug
6. silly
```

## Uncaught Exceptions

`error` 미들웨어는 `Express Request and Response`와 관련된 오류에만 사용할 수 있습니다. 이 범주를 벗어난 예상치 못한 오류 및 예외를 처리하는 방법에 대해 알아보겠습니다.

```javascript
// middleware/error.js
const winston = require("winston");

module.exports = function (err, req, res, next) {
  //   winston.log("error: ", err.message);
  winston.error(err.message, err);

  // error
  // warn
  // info
  // verbose
  // debug
  // silly

  // res.status(500).send("Something Failed");
  res.status(500).send(err);
};
```

다음과 같이 요청 발생 이전에 오류를 발생한 경우, `Express` 미들웨어는 `uncaughtException`을 처리하지 못합니다.

```javascript
// index.js
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});

throw new Error("Something Failed During startup");

// ... Express Middleware and Routes
```

`process` 객체를 이용해 `uncaughtException`를 처리할 수 있습니다.

```javascript
// index.js
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
});

// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});

throw new Error("Something Failed During startup");

// ... Express Middleware and Routes
```

## Unhandled Promise Rejection

앞서 본 `uncaughtException`을 처리하는 로직은 동기적 코드에만 적용할 수 있다는 단점이 있습니다. 이를 보완하고자 비동기 `uncaughtException` 또한 처리하는 방법에 대해 알아보겠습니다.

```javascript
// index.js
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
});

// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});

throw new Error("Something Failed During startup");

// ... Express Middleware and Routes
```

`Promise`를 리턴하는 변수를 정의하고 `reject` 로직은 처리하지 않고 `then`을 이용해 `resolve`만 처리한 경우
`UnhandledPromiseRejectionWarning` 오류가 발생합니다.

```javascript
// index.js
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
});

// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});

throw new Error("Something Failed During startup");

const p = Promise.reject(new Error("SOMETHING FAILED MISERABLY!"));
p.then(() => console.log("Done"));

// ... Express Middleware and Routes
```

`process` 객체를 이용해 `unhandledRejection` 오류를 처리하는 `Event Listener`를 추가하는 방식으로 오류를 해결할 수 있습니다. 또한 베스트 프렉티스로 다음 두 오류가 발생했을 때는 시스템을 종료해주는 것이 좋습니다.

1. `uncaughtException`
2. `unhandledRejection`

```javascript
// index.js
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

process.on("unhandledRejection", (ex) => {
  console.log("WE GOT AN UNHANDLED REJECTION");
  winston.error(ex.message, ex);
  process.exit(1);
});
// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});

throw new Error("Something Failed During startup");

const p = Promise.reject(new Error("SOMETHING FAILED MISERABLY!"));
p.then(() => console.log("Done"));

// ... Express Middleware and Routes
```

다음 두 오류 밑 예외 처리된 오류를 별도의 로그로 남기고 싶은 경우 다음과 같이 `transports`를 추가할 수 있습니다.
하지만 다음 방법은 `uncaughtException`에 해당하는 예외 및 오류만을 추적할 수 있습니다.

1. `uncaughtException`

```javascript
// index.js
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (ex) => {
  console.log("WE GOT AN UNHANDLED REJECTION");
  winston.error(ex.message, ex);
  process.exit(1);
});
// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});

throw new Error("Something Failed During startup");

const p = Promise.reject(new Error("SOMETHING FAILED MISERABLY!"));
p.then(() => console.log("Done"));

// ... Express Middleware and Routes
```

다음 두 이벤트를 모두 추적하고 싶은 경우 `uncaughtException`이 `throw` 구문을 통해 추적된다는 점을 이용해, `unhandledRejection` 이벤트 핸들러 로직에 `throw` 구문을 추가해주면 됩니다. `uncaughtException`은 `winston.handleExceptions` 내부에서 처리되기 때문에 별도로 정의하지 않아도 됩니다.

1. `uncaughtException`
2. `unhandledRejection`

```javascript
// index.js
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (ex) => {
  console.log("WE GOT AN UNHANDLED REJECTION");
  throw ex;
});
// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});

throw new Error("Something Failed During startup");

const p = Promise.reject(new Error("SOMETHING FAILED MISERABLY!"));
p.then(() => console.log("Done"));

// ... Express Middleware and Routes
```

## Error Handling Recap

1. `Express Error Middleware`

- `HTTP Request` 과정에 발생한 오류를 잡는 데 사용할 수 있습니다.
- `Express Request` 범위를 벗어난 오류는 추적하지 못합니다.

2. `winston.handleExceptions`

- `Express Error Middleware` 모듈이 잡지 못하는 예외 및 오류를 잡는 데 사용할 수 있습니다.
- 1. `uncaughtExceptions`
- 2. `unhandledRejection`
- 위 두 오류가 발생하였을 때 베스트 프렉티스로 프로세스를 종료해주는 것이 좋습니다.

## Extracting Routes

`index.js`에는 다음 5개의 내용이 한 파일에 구조 없이 정의되어 있습니다. 이를 체계적이게 리팩토링 해보겠습니다.

1. 여러 종류의 모듈
2. 서로 다른 오류 처리
3. 데이터베이스 연결
4. 미들웨어 정의
5. 포트 정의

```javascript
// index.js
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const error = require("./middleware/error");
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

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (ex) => {
  console.log("WE GOT AN UNHANDLED REJECTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});

const p = Promise.reject(new Error("SOMETHING FAILED MISERABLY!"));
p.then(() => console.log("Done"));

// export vidly_jwtPrivateKey=mySecureKey
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

app.use(error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

1. `startup/routes.js`

```javascript
// startup/routes.js
const express = require("express");
const error = require("../middleware/error");
const genres = require("../routes/genres");
const users = require("../routes/users");
const customers = require("../routes/customers");
const movies = require("../routes/movies");
const rentals = require("../routes/rentals");
const auth = require("../routes/auth");

module.exports = function (app) {
  app.use(express.json());
  app.use("/api/genres", genres);
  app.use("/api/customers", customers);
  app.use("/api/movies", movies);
  app.use("/api/rentals", rentals);
  app.use("/api/users", users);
  app.use("/api/auth", auth);
  app.use(error);
};
```

```javascript
// index.js
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const Fawn = require("fawn");
const express = require("express");
const app = express();
require("./startup/routes")(app);

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (ex) => {
  console.log("WE GOT AN UNHANDLED REJECTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});

const p = Promise.reject(new Error("SOMETHING FAILED MISERABLY!"));
p.then(() => console.log("Done"));

// export vidly_jwtPrivateKey=mySecureKey
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined...");
  process.exit(1);
}

mongoose
  .connect("mongodb://127.0.0.1:27017/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB..."));

Fawn.init("mongodb://127.0.0.1:27017/vidly");

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

## Extracting the DB Logic

데이터베이스 실행 로직을 리펙토링해보겠습니다.

1. `startup/db.js`

```javascript
// startup/db.js
const winston = require("winston");
const mongoose = require("mongoose");
const Fawn = require("fawn");

module.exports = function () {
  mongoose
    .connect("mongodb://127.0.0.1:27017/vidly")
    .then(() => winston.info("Connected to MongoDB..."));
  // winston promise rejection에 의해 처리됩니다.
  // .catch((err) => winston.error("Could not connect to MongoDB..."));

  Fawn.init("mongodb://127.0.0.1:27017/vidly");
};
```

```javascript
// index.js
require("express-async-errors");
const winston = require("winston");
require("winston-mongodb");
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();
require("./startup/routes")(app);
require("./startup/db")();

process.on("uncaughtException", (ex) => {
  console.log("WE GOT AN UNCAUGHT EXCEPTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

winston.handleExceptions(
  new winston.transports.File({ filename: "uncaughtExceptions.log" })
);

process.on("unhandledRejection", (ex) => {
  console.log("WE GOT AN UNHANDLED REJECTION");
  winston.error(ex.message, ex);
  process.exit(1);
});

// transport 추가 하는 방법
winston.add(winston.transports.File, { filename: "logfile.log" });
winston.add(winston.transports.MongoDB, {
  db: "mongodb://127.0.0.1:27017/vidly",
});

const p = Promise.reject(new Error("SOMETHING FAILED MISERABLY!"));
p.then(() => console.log("Done"));

// export vidly_jwtPrivateKey=mySecureKey
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined...");
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

## Extracting the Logging Logic

```javascript
// startup/logging
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    console.log("WE GOT AN UNHANDLED REJECTION");
    winston.error(ex.message, ex);
    process.exit(1);
  });

  // transport 추가 하는 방법
  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.MongoDB, {
    db: "mongodb://127.0.0.1:27017/vidly",
    level: "info",
  });
};
```

```javascript
// index.js
const config = require("config");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();

// export vidly_jwtPrivateKey=mySecureKey
if (!config.get("jwtPrivateKey")) {
  console.log("FATAL ERROR: jwtPrivateKey is not defined...");
  process.exit(1);
}

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

## Extracting the Config Logic

```javascript
// startup/config.js
const config = require("config");

module.exports = function () {
  // export vidly_jwtPrivateKey=mySecureKey
  if (!config.get("jwtPrivateKey")) {
    throw new Error("FATAL ERROR: jwtPrivateKey is not defined...");
    // process.exit(1);
  }
};
```

```javascript
// index.js
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```

## Extracting the Validation Logic

```javascript
// startup/validation.js
const Joi = require("joi");

module.exports = function () {
  Joi.objectId = require("joi-objectid")(Joi);
};
```

```javascript
// index.js
const winston = require("winston");
const express = require("express");
const app = express();

require("./startup/logging");
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/config")();
require("./startup/validation")();

const port = process.env.PORT || 3000;
app.listen(port, () => winston.info(`Listening on port ${port}...`));
```

## Showing Unhandled Exceptions on the Console

현재 로직은 프로세스가 강제종료 된면 그 이유를 출력해주지 않습니다. 강제종료 이유를 출력할 수 있도록 구현해보겠습니다.

`Before`

- `File Transports`만 적용

`After`

- `Console Transports`를 적용해 커멘드 라인에 강제종료 이유 출력
- 눈에 띄게 하기 위해 색을 추가했습니다.

```javascript
// startup/logging.js
const winston = require("winston");
require("winston-mongodb");
require("express-async-errors");

module.exports = function () {
  winston.handleExceptions(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: "uncaughtExceptions.log" })
  );

  process.on("unhandledRejection", (ex) => {
    console.log("WE GOT AN UNHANDLED REJECTION");
    winston.error(ex.message, ex);
    process.exit(1);
  });

  // transport 추가 하는 방법
  winston.add(winston.transports.File, { filename: "logfile.log" });
  winston.add(winston.transports.MongoDB, {
    db: "mongodb://127.0.0.1:27017/vidly",
    level: "info",
  });
};
```
