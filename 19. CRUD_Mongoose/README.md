# CRUD_Moongoose

## Schema

<img src="https://cdn-images-1.medium.com/max/800/1*OjdFicGQ-PBXwvwXSIIkMw.png" />

```javascript
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
mongoose.connect("mongodb://localhost:27017/playground");

mongoose.connection.on("error", (err) => {
  console.log("err", err);
});

mongoose.connection.on("connected", (err, res) => {
  console.log("mongoose is connected");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`app is listening to PORT ${PORT}`);
});

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: {
    type: Date,
    default: Date.now,
  },
  isPublished: Boolean,
});
```

## Models

```javascript
const Course = mongoose.model("Course", courseSchema);
const course = new Course({
  name: "Node.js Course",
  author: "Yongsu",
  tags: ["node", "backend"],
  isPublished: true,
});
```

## Saving a Document

```javascript
const result = await course.save();
```

`async/await` 키워드를 정의하지 않아서 오류 발생

```javascript
async function createCourse() {
  const course = new Course({
    name: "Node.js Course",
    author: "Yongsu",
    tags: ["node", "backend"],
    isPublished: true,
  });

  const result = await course.save();
  console.log(result);
}

createCourse();
```

## Querying Documents

```javascript
async function getCourses() {
  const courses = await Course.find({ author: "Yongsu", isPublished: true })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}

getCourses();
```

## Comparison Query Operations

```javascript
async function getCourses() {
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  const courses = await Course
    // .find({ price: { $gte: 10, $lts: 20 } })
    .find({ price: { $in: [10, 15, 20] } })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}
```

## Logical Query Operator

```javascript
async function getCourses() {
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  const courses = await Course
    // .find({ price: { $gte: 10, $lts: 20 } })
    .find()
    // .or([{ author: "Yongsu" }, { isPublished: true }])
    .and([{ author: "Yongsu", isPublished: true }]) // 사실상 find와 동일
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}
```

## Regular Expressions

- i: case insensitive

```javascript
async function getCourses() {
  // eq (equal)
  // ne (not equal)
  // gt (greater than)
  // gte (greater than or equal to)
  // lt (less than)
  // lte (less than or equal to)
  // in
  // nin (not in)

  const courses = await Course
    // starts with Yongsu
    .find({ author: /^Yongsu/ })
    // Ends with Jeong
    .find({ author: /Jeong$/i })
    // Contains Yongsu
    .find({ author: /.*Yongsu.*/ })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}
```

## Counting

```javascript
async function getCourses() {
  const courses = await Course.find({ author: "Yongsu", isPublished: true })
    .limit(10)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 })
    .count();

  console.log(courses);
}
```

## Pagination

```javascript
async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course.find({ author: "Yongsu", isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 })
    .count();

  console.log(courses);
}
```

## Exercise 1

GET all the published backend courses
sort them by their name,
pick only their name and author
and display them

```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/mongo-exercises");

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

async function getCourses() {
  return await Course.find({ isPublished: true, tags: "backend" })
    .sort({ name: 1 })
    .select({ name: 1, author: 1 });
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
```

## Exercise 2

Get all the published frontend and backend courses,
sort them by their price in a descending order,
pick only their name and author,
and display them

```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/mongo-exercises");

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

async function getCourses() {
  return await Course.find({ isPublished: true })
    .or([{ tags: "frontend" }, { tags: "backend" }])
    .sort("-price")
    .select("name author price");
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
```

## Exercise 3

Get all the published courses that are $15 or more,
or have the word "by" in their title

```javascript
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/mongo-exercises");

const courseSchema = new mongoose.Schema({
  name: String,
  author: String,
  tags: [String],
  date: Date,
  isPublished: Boolean,
  price: Number,
});

const Course = mongoose.model("Course", courseSchema);

async function getCourses() {
  return await Course.find({ isPublished: true })
    .or([{ price: { $gte: 15 } }, { name: /.*by.*/i }])
    .sort("-price")
    .select("name author price");
}

async function run() {
  const courses = await getCourses();
  console.log(courses);
}

run();
```

## Updating a Document-Query First

이 방식은 사용자로 부터 `input` 데이터를 받는 경우 유용하게 사용할 수 있습니다.

```javascript
async function updateCourse(id) {
  // Approach: Query First
  // findById()
  // Modify its properties
  // save()
  const course = await Course.findById(id);
  if (!course) return;

  if (course.isPublished) return;
  course.isPublished = true;
  course.author = "Jeong Yongsu";

  const result = await course.save();
  console.log(result);

  // --------------------------------
  // Approach: Update First
  // Update Directly
  // Optionally: get the updated document
}

updateCourse("object_id");
```

## Updating a Document-Update First

`findByIdAndUpdate`는 업데이트 한 객체를 리턴합니다.

```javascript
async function updateCourse(id) {
  // Approach: Query First
  // findById()
  // Modify its properties
  // save()
  //   const course = await Course.findById(id);
  //   if (!course) return;
  //   if (course.isPublished) return;
  //   course.isPublished = true;
  //   course.author = "Jeong Yongsu";
  //   const result = await course.save();
  //   console.log(result);
  // --------------------------------
  // Approach: Update First
  // Update Directly
  // Optionally: get the updated document

  const course = await Course.findByIdAndUpdate(
    { _id: id },
    {
      $set: {
        author: "Jeong",
        isPublished: false,
      },
    }
  );

  console.log(course);
}

updateCourse("object_id");
```

## Removing Documents

```javascript
async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id });
  const results = await Course.deleteMany({ _id: id });
  const removedCourse = await Course.findByIdAndRemove(id);
  console.log(result);
}
```

## Summary
