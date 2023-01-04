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
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    // match: /pattern/,
  },
  category: {
    type: String,
    required: true,
    enum: ["web", "mobile", "network"],
    lowercase: true,
    trim: true,
  },
  author: String,
  tags: {
    type: Array,
    validate: {
      isAsync: true,
      validator: function (v, callback) {
        setTimeout(() => {
          // Do some async work
          const result = v && v.length > 0;
          callback(result);
        }, 4000);
      },
      message: "A course should have at least one tag...",
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isPublished: Boolean,
  price: {
    type: Number,
    required: function () {
      return this.isPublished;
    },
    min: 10,
    max: 200,
    get: (v) => Math.round(v),
    set: (v) => Math.round(v),
  },
});

const Course = mongoose.model("Course", courseSchema);

async function createCourse() {
  const course = new Course({
    name: "Node.js Course",
    category: "Web",
    author: "Yongsu",
    tags: ["frontend"],
    isPublished: true,
    price: 15.8,
  });

  try {
    const result = await course.save();
    console.log(result);
  } catch (ex) {
    for (field in ex.errors) {
      console.log(ex.errors[field]);
    }
  }
}

async function getCourses() {
  const pageNumber = 2;
  const pageSize = 10;
  // /api/courses?pageNumber=2&pageSize=10

  const courses = await Course.find({ _id: "mongo_object" })
    .sort({ name: 1 })
    .select({ name: 1, tags: 1, price: 1 });

  console.log(courses[0].price);
}

getCourses();

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
