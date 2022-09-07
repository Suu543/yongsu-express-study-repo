const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/test")
  .then(() => console.log("Connection Open!"))
  .catch((err) => {
    console.log("Connection Failed...");
    console.log("Error: ", err);
  });

/**
 * title
 * year
 * score
 * rating
 */

const movieSchema = new mongoose.Schema({
  title: String,
  year: Number,
  score: Number,
  rating: String,
});

// movies
const Movie = mongoose.model("Movie", movieSchema);
const amedeus = new Movie({
  title: "Amadeus",
  year: 1986,
  score: 9.2,
  rating: "R",
});

Movie.insertMany([
  { title: "Amelie", year: 2021, score: 8.3, rating: "R" },
  { title: "Hello World", year: 1999, score: 8.3, rating: "R" },
  { title: "Amelie", year: 2021, score: 8.3, rating: "R" },
  { title: "Amelie", year: 2021, score: 8.3, rating: "R" },
  { title: "Amelie", year: 2021, score: 8.3, rating: "R" },
]).then((data) => {
  console.log("It worked!");
  console.log(data);
});

