# Mongoose Modeling Relationships between Connected Data

## Modeling Relationships

```javascript
// Course, Author,

// Trade off between query performance vs consistency

// Using References (Normalization) ==> Consistency
// 다음과 같이 정의하고, 내일 name을 변경하고 싶은 경우 한 부분만 변경하면된다.
let author = {
  name: "Yongsu",
};

let course = {
  author: "id",
  authors: ["id1", "id2"],
};

// Using Embedded Documents (Denormalization) ==> Performance
// 다음과 같이 정의하고, 내일 name을 변경하고 싶은 경우 다수의 course를 업데이트 해야 한다는 문제가 발생합니다.
let course = {
  author: {
    name: "Yongsu",
  },
};

// Hybrid
let author = {
  name: "Yongsu",
  // 50 other properties
};

let course = {
  author: {
    id: "ref",
    name: "yongsu",
  },
};
```

## Referencing Documents

```javascript
// population.js
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const Author = mongoose.model(
  "Author",
  new mongoose.Schema({
    name: String,
    bio: String,
    website: String,
  })
);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Author",
    },
  })
);

async function createAuthor(name, bio, website) {
  const author = new Author({
    name,
    bio,
    website,
  });

  const result = await author.save();
  console.log(result);
}

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find().select("name");
  console.log(courses);
}

// 1.
// createAuthor("Mosh", "My bio", "My Website");

// 2.
// createCourse('Node Course', 'authorId')

// 3.
// listCourses();
```

## Population

population: 객체 참조 값을 풀어 내부 정보에 접근함을 의미합니다.

```javascript
async function listCourses() {
  const courses = await Course.find().populate("author").select("name author");

  // 이름만 추출하고 싶은 경우
  const courses = await Course.find()
    .populate("author name")
    .select("name author");
  console.log(courses);

  // _id는 추출하고 싶지 않은 경우
  const courses = await Course.find()
    .populate("author", "name -_id")
    .select("name author");
  console.log(courses);

  // 여러 object를 추출하고 싶은 경우
  const courses = await Course.find()
    .populate("author", "name -_id")
    .populate("category", "name")
    .select("name author");
  console.log(courses);
}
```

## Embedding Documents

```javascript
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    author: {
      type: authorSchema,
      required: true,
    },
  })
);

async function createCourse(name, author) {
  const course = new Course({
    name,
    author,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  // version 1
  let course = await Course.findById(courseId);
  course.author.name = "Yongsu Jeong";
  course.save();

  // version 2
  course = await Course.update(
    { _id: courseId },
    {
      $set: {
        "author.name": "Jeong Yongsu",
      },
    }
  );

  // version 3
  course = await Course.update(
    { _id: courseId },
    {
      $unset: {
        author: "",
      },
    }
  );
}

createCourse("Node Course", new Author({ name: "Yongsu" }));
```

## Using an Array of Sub-documents

```javascript
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost/playground")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Could not connect to MongoDB...", err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String,
});

const Author = mongoose.model("Author", authorSchema);

const Course = mongoose.model(
  "Course",
  new mongoose.Schema({
    name: String,
    authors: [authorSchema],
  })
);

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors,
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

// 1
async function updateAuthor(courseId) {
  // version 1
  let course = await Course.findById(courseId);
  course.author.name = "Yongsu Jeong";
  course.save();
}

// 2
async function addAuthor(courseId, author) {
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

// 3.
async function removeAuthor(courseId, authorId) {
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

createCourse("Node Course", [
  new Author({ name: "Yongsu" }),
  new Author({ name: "Jeong" }),
]);

addAuthor("objectid", new Author({ name: "jeong yong" }));
removeAuthor("course_object_id", "author_object_id");
```

## Build the Movies API

- after-movie 폴더 참조

<img src="https://cdn-images-1.medium.com/max/800/1*12oIbPSM5KEGBWC-a33lxg.png" />

## Build the Rentals API

- after-rentals 폴더 참조

## Transactions

<img src="https://cdn-images-1.medium.com/max/800/1*s-NdKm-dDmBMAoqFeDQUzQ.png" />

`Transaction`: 다음 사진과 하나의 집합으로 수행되는 동작입니다.

한 집합의 동작 중 하나의 동작에 문제가 발생하면, 전체 동작을 이전 상태로 되돌리는 등 `Transaction`은 데이터 일관성에 있어 중요한 요소입니다. `MongoDB`는 이러한 `transaction`을 지원하지 않기 때문에, `2 Phase Commit` 패턴 등을 활용해야합니다.

- https://www.mongodb.com/docs/v2.2/tutorial/perform-two-phase-commits/

```bash
npm install fawn
```

```javascript
// routes/rentals.js
router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer.");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie.");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in stock.");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  // rental = await rental.save();
  // movie.numberInStock--;
  // movie.save();

  // {
  //   "customerId": "...",
  //   "movieId": "..."
  // }

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    // rental 객체는 재할당하지 않았음에도, mongoose 내부적으로 반영해 설정했기 때문에 정상 동작합니다.
    res.send(rental);
  } catch (ex) {
    // Internal Server Error
    res.status(500).send("Something Failed...");
  }
});
```

## ObjectId

- fawn 폴더 참조

```javascript
//  _id: 5a2131315421551512512512
// 12 bytes = Unique Identified Document in MongoDB
// - 4 bytes: timestamp
// - 3 bytes: machine identifier
// - 2 bytes: process identifier
// - 3 bytes: counter (ex: Auto-Incrementing Number)

// 1 bytes = 8 bits
// - 2 ^ 8 = 256
// - 2 ^ 24 = 16M (이상인 경우 counter overflow 발생)

// SQL 방식은 이전 데이터를 기준으로 +1 하는 방식이기 때문에 unique identifier 방식의 구현이 가능하지만,
// 일일이 생성해야 하므로 어느 정도 시간이 소요됩니다.
// MongoDB는 12 bytes를 사용해 바로 생성하고,
// MongoDB는 SQL처럼 central place와 소통할 필요가 없어서 확장성이 좋고 속도가 빠릅니다.

// ID를 직접 생성하는 법
const mongoose = require("mongoose");
const id = new mongoose.Types.ObjectId();
console.log(id);
console.log(id.getTimestamp()); // First 4 bytes

// 유효한 mongoDB ID인지 검증하는 법
const isValid = mongoose.Types.ObjectId.isValid("1234");
console.log(isValid);
```

## Validating ObjectIDs

유효하지 않은 `objectId`를 입력했을 때 발생하는 오류를 처리하는 로직을 정의해보겠습니다.

- https://www.npmjs.com/package/joi-objectid

```bash
npm install joi-objectid
```

```javascript
// models/rentals.js
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");

const Rental = mongoose.model(
  "Rental",
  new mongoose.Schema({
    customer: {
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
        isGold: {
          type: Boolean,
          default: false,
        },
        phone: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50,
        },
      }),
      required: true,
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true,
          minlength: 5,
          maxlength: 255,
        },
        dailyRentalRate: {
          type: Number,
          required: true,
          min: 0,
          max: 255,
        },
      }),
      required: true,
    },
    dateOut: {
      type: Date,
      required: true,
      default: Date.now,
    },
    dateReturned: {
      type: Date,
    },
    rentalFee: {
      type: Number,
      min: 0,
    },
  })
);

function validateRental(rental) {
  const schema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  });

  return schema.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental;
```

## Better Implementation

- fawm 폴더 참조

`ObjectId`는 `rental` 모델뿐만 아니라 다른 모델에도 사용되기 때문에, 모든 모델이 접근할 수 있도록 리펙토링 해보겠습니다.

`index.js` 파일이 `gateway` 역할을 하므로, `Joi` 모듈에 `objectId` 객체를 등록하면 다른 모델 파일에서 `Joi` 모듈을 호출할 때 `objectId`에 접근할 수 있습니다.

```javascript
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const genres = require("./routes/genres");
const customers = require("./routes/customers");
const movies = require("./routes/movies");
const rentals = require("./routes/rentals");
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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
```
