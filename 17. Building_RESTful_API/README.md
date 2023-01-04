# RESTful Services

<img src="https://cdn-images-1.medium.com/max/800/1*K_ChNhxlUwbPWX2m2FZzbw.png" />
<img src="https://cdn-images-1.medium.com/max/800/1*7JlGZLZRzJ6PLkzKyHNHKg.png" />
<img src="https://cdn-images-1.medium.com/max/800/1*X2Z_o810Dkbsv-sWOZjLYg.png" />
<img src="https://cdn-images-1.medium.com/max/800/1*anZ3bYdbytUcKddcjuIL7A.png" />
<img src="https://cdn-images-1.medium.com/max/800/1*anZ3bYdbytUcKddcjuIL7A.png" />
<img src="https://cdn-images-1.medium.com/max/800/1*zAV0T1_IyzLd1XY2B8D98Q.png" />
<img src="https://cdn-images-1.medium.com/max/800/1*qmJRjZ-FMIhUWL7rstavsQ.png" />
<img src="https://cdn-images-1.medium.com/max/800/1*i_VaEcMTa2acb2Z5fMHPjg.png" />
<img src="https://cdn-images-1.medium.com/max/800/1*nN91NB90qr-MUzy3zgpvrA.png" />
<img src="https://cdn-images-1.medium.com/max/800/1*T1IzWEK1mv4cFQWvPJCl0w.png" />

## Building Your First Web Server

```javascript
// index.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3]);
});

app.listen(3000, () => console.log("Listening on port 3000..."));
```

## Environment Variables

`PORT` 번호는 3000번으로 직접 작성했지만, 이를 환경 변수로 만들어 서버 배포 시 환경변수 설정과 동시에 포트가 맵핑 되도록 설정할 수 있습니다.

```javascript
// .env
PORT = 5000;
```

```javascript
// index.js
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Listening on port ${PORT}...`));
```

## Route Parameters

1. `url` 주소값의 인자 값을 추출하고 싶은 경우: req.params
2. `url` 주소의 `query-string`을 추출하고 싶은 경우: req.query

```javascript
// index.js
const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.get("/api/courses", (req, res) => {
  res.send([1, 2, 3]);
});

// api/courses/1
// api/courses/2
app.get("/api/courses/:year/:month", (req, res) => {
  console.log(req.params); // /api/courses/2018/1
  console.log(req.query); // /api/courses/2018/1?sortBy=name

  res.send(req.params);
});

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

## Handling GET Requests

```javascript
const express = require("express");
const app = express();

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
  if (!course) {
    res.status(404).send("The course with the given ID was not found...");
  }

  res.send(course);
});

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

Testcase

- `localhost:3000/api/courses/1`
- `localhost:3000/api/courses/2`
- `localhost:3000/api/courses/3`

## Handling POST Requests

```javascript
const express = require("express");
const app = express();

app.use(express.json());

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
  if (!course) {
    res.status(404).send("The course with the given ID was not found...");
  }

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

## Calling Endpoints Using Postman

1. url: `http://localhost:3000/api/courses`
2. Body => raw => JSON

```json
{
  "name": "new course"
}
```

## Input Validation

보안 원칙으로서 클라이언트가 보내는 어떠한 데이터도 신뢰하지 않아야 합니다.

```javascript
// index.js
app.post("/api/courses", (req, res) => {
  if (!req.body.name || req.body.name.length < 3) {
    // 400 Bad Request
    res.status(400).send("Name is required and should be minimum 3 characters");
    return;
  }

  const course = {
    id: courses.length + 1,
    name: req.body.name,
  };

  courses.push(course);
  res.send(course);
});
```

매번 위와 같이 `name` 검증 로직을 작성하는 것은 번거롭습니다. `Joi` 모듈은 번거로운 보안 로직을 보다 간편하고 체계적으로 관리할 수 있는 기능을 제공합니다.

- https://www.npmjs.com/package/joi

```bash
npm install joi
```

```javascript
const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

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
  if (!course) {
    res.status(404).send("The course with the given ID was not found...");
  }

  res.send(course);
});

app.post("/api/courses", (req, res) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const result = schema.validate(req.body);
  console.log(result);

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

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

## Handling HTTP PUT Requests

```javascript
const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

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
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const result = schema.validate(req.body);
  console.log(result);

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
  if (!course)
    res.status(404).send("The course with the given ID was not found...");

  // Validate
  // If invalid, return 400 - Bad Request
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  const result = schema.validate(req.body);
  console.log(result);

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

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

`Joi` 검증 로직이 반복되고 있습니다. 이 부분을 별도의 함수로 만들어 재사용성을 개선해보겠습니다.

```javascript
// index.js
const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

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
  if (!course)
    res.status(404).send("The course with the given ID was not found...");

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

function validateCourse(course) {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
  });

  return schema.validate(course);
}

const PORT = process.env.PORT || 5000;
app.listen(3000, () => console.log("Listening on port 3000..."));
```

## Handling HTTP Delete Requests

```javascript
const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

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
  if (!course)
    res.status(404).send("The course with the given ID was not found...");

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
  if (!course)
    res.status(404).send("The course with the given ID was not found...");

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

코드 버그를 수정해보겠습니다.

해당 코스가 존재하지 않는 경우 `res.status(404)` 응답을 보냈지만, `return`을 호출하지 않았기 때문에 응답 전달했음에도 함수가 종료되지 않는 문제가 발생합니다. `return`을 추가해 이 문제를 해결해보겠습니다.

```javascript
const Joi = require("joi");
const express = require("express");
const app = express();

app.use(express.json());

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

## Project

- http://vidly.com/api/genres
