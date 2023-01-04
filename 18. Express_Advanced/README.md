# Express-Advanced Topics

- Middleware
- Configuration
- Debugging
- Templating Engines

## Middleware

`express.json`: `json` 형태로 들어온 요청의 데이터를 `req.body`에 붙여줍니다.

<img src="https://cdn-images-1.medium.com/max/800/1*HJRBcG0UObvP1jqP8KGaRA.png" />

## Creating Custom Middleware

```javascript
// logger.js
function log(req, res, next) {
  console.log("Logging...");
  next();
}

module.exports = log;
```

```javascript
// index.js
const Joi = require("joi");
const logger = require("./logger");
const express = require("express");
const app = express();

app.use(express.json());
app.use(logger);

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3]);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given ID was not found...");

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);

  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  // Look up the course
  // If not existing, return 404

  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID was not found...");
  }

  // Validate
  // If invalid, return 400 - Bad Request

  const result = validateCourse(req.body);

  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // Update Course
  course.name = req.body.name;

  // Return the updated course
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  // Look up the course
  // Not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID was not found...");
  }

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the same course
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

## Built-in Middleware

```javascript
app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true })); // req.body: key=value?key=value
app.use(express.static("public"));
```

```javascript
// public/readme.txt
This is a readme file1
```

- localhost:3000/readme.txt

## Third-party Middleware

```javascript
const Joi = require("joi");
const logger = require("./logger");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true })); // req.body: key=value?key=value
app.use(express.static("public"));
app.use(helmet());
app.use(morgan("dev"));
```

## Environments

`morgan` 미들웨어를 개발 상태에서만 호출되도록 구현해보겠습니다.

```javascript
// process: global object in node
// 방법 1
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// 방법 2 - process.env.NODE_ENV가 설정되지 않은 경우 기본값을 development return
console.log(app.get("env"));

app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true })); // req.body: key=value?key=value
app.use(express.static("public"));
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan Enabled...");
}
```

## Configurations

```bash
npm install config
```

```javascript
const config = require("config");
const Joi = require("joi");
const logger = require("./logger");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

// Configuration
console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

app.use(express.json()); // req.body
app.use(express.urlencoded({ extended: true })); // req.body: key=value?key=value
app.use(express.static("public"));
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  console.log("Morgan Enabled...");
}

app.use(morgan("dev"));

app.use(logger);

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3]);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given ID was not found...");

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);

  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  // Look up the course
  // If not existing, return 404

  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID was not found...");
  }

  // Validate
  // If invalid, return 400 - Bad Request

  const result = validateCourse(req.body);

  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // Update Course
  course.name = req.body.name;

  // Return the updated course
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  // Look up the course
  // Not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID was not found...");
  }

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the same course
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

## Debugging

- https://jaenjoy.tistory.com/16

```bash
npm install debug
```

```javascript
const debug = require("debug")("app:startup");
const config = require("config");
const Joi = require("joi");
const logger = require("./logger");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan Enabled...");
}

app.use(morgan("dev"));

app.use(logger);

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3]);
});

app.get("/api/courses/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given ID was not found...");

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const result = validateCourse(req.body);

  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

app.put("/api/courses/:id", (req, res) => {
  // Look up the course
  // If not existing, return 404

  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID was not found...");
  }

  // Validate
  // If invalid, return 400 - Bad Request

  const result = validateCourse(req.body);

  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // Update Course
  course.name = req.body.name;

  // Return the updated course
  res.send(course);
});

app.delete("/api/courses/:id", (req, res) => {
  // Look up the course
  // Not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID was not found...");
  }

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the same course
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

## Templating Engines

```bash
npm install pug
```

```javascript
const debug = require("debug")("app:startup");
const config = require("config");
const Joi = require("joi");
const logger = require("./logger");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

console.log("Application Name: " + config.get("name"));
console.log("Mail Server: " + config.get("mail.host"));
console.log("Mail Password: " + config.get("mail.password"));

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan Enabled...");
}

app.use(morgan("dev"));
app.use(logger);

app.get("/", (req, res) => {
  res.render("index", { title: "My Express App", message: "Hello" });
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

```html
<!-- views/index.pug -->
html head title = title body h1 = message
```

## Structuring Express Applications

```javascript
// routes/home.js
const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.render("index", { title: "My Express App", message: "Hello" });
});

module.exports = router;
```

```javascript
// routes/courses.js
const express = require("express");
const router = express.Router();

const courses = [
  { id: 1, name: "course1" },
  { id: 2, name: "course2" },
  { id: 3, name: "course3" },
];

router.get("/", (req, res) => {
  res.send([1, 2, 3]);
});

router.get("/:id", (req, res) => {
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course)
    res.status(404).send("The course with the given ID was not found...");

  res.send(course);
});

router.post("/", (req, res) => {
  const result = validateCourse(req.body);

  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

router.put("/:id", (req, res) => {
  // Look up the course
  // If not existing, return 404

  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID was not found...");
  }

  // Validate
  // If invalid, return 400 - Bad Request

  const result = validateCourse(req.body);

  if (result.error) {
    // 400 Bad Request
    res.status(400).send(result.error.details[0].message);
    return;
  }

  // Update Course
  course.name = req.body.name;

  // Return the updated course
  res.send(course);
});

router.delete("/api/:id", (req, res) => {
  // Look up the course
  // Not existing, return 404
  const course = courses.find((c) => c.id === parseInt(req.params.id));
  if (!course) {
    return res
      .status(404)
      .send("The course with the given ID was not found...");
  }

  // Delete
  const index = courses.indexOf(course);
  courses.splice(index, 1);

  // Return the same course
  res.send(course);
});

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

module.exports = router;
```

```javascript
// middleware/logger.js
function log(req, res, next) {
  console.log("Logging...");
  next();
}

module.exports = log;
```

```javascript
// index.js
const debug = require("debug")("app:startup");
const config = require("config");
const Joi = require("joi");
const logger = require("./middleware/logger");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();

// routes
const home = require("./routes/home");
const courses = require("./routes/courses");

app.set("view engine", "pug");
app.set("views", "./views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(helmet());

app.use("/", home);
app.use("/api/courses", courses);

if (app.get("env") === "development") {
  app.use(morgan("tiny"));
  debug("Morgan Enabled...");
}

app.use(morgan("dev"));

app.use(logger);

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

## Project - Restructuring the App

- vidly

```markdown
Express: Advanced Topics

- A middleware function is a function that takes a request object and either terminates the request/response cycle or passes control to another middleware function.
- Express has a few built-in middleware functions:
- json(): to parse the body of requests with a JSON payload
- urlencoded(): to parse the body of requests with URL-encoded payload
- static(): to serve static files
- You can create custom middleware for cross-cutting concerns, such as logging, authentication, etc. // Custom middleware (applied on all routes)

- app.use(function(req, res, next)) { // ... next(); } // Custom middleware (applied on routes starting with /api/admin)

- app.use(‘/api/admin’, function(req, res, next)) { // ... next(); }

- We can detect the environment in which our Node application is running (development, production, etc) using process.env.NODE_ENV and app.get(‘env’).

- The config package gives us an elegant way to store configuration settings for our applications.

- We can use the debug package to add debugging information to an application. Prefer this approach to console.log() statements.

- To return HTML markup to the client, use a templating engine. There are various templating engines available out there. Pug, EJS and Mustache are the most popular ones
```

## Todolist

- config module
- debug module
