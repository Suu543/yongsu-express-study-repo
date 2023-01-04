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

const Course = mongoose.model("Course", courseSchema);

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

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course.find({ author: "Yongsu", isPublished: true })
    .skip((pageNumber - 1) * pageSize)
    .limit(pageSize)
    .sort({ name: 1 })
    .select({ name: 1, tags: 1 });

  console.log(courses);
}

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

async function removeCourse(id) {
  const result = await Course.deleteOne({ _id: id });
  console.log(result);
}
