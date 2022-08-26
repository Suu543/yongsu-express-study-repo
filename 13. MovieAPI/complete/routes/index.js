const axios = require("axios");
const express = require("express");
const router = express.Router();

const apiKey = "1fb720b97cc13e580c2c35e1138f90f8";
const apiBaseUrl = "https://api.themoviedb.org/3";
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = "http://image.tmdb.org/t/p/w300";

router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

router.get("/", async (req, res, next) => {
  console.log("");
  console.log(nowPlayingUrl);
  const response = await axios.get(nowPlayingUrl);
  const fetchedData = response.data;
  // res.json(parsedData);

  res.render("index", {
    parsedData: fetchedData.results,
  });
});

// /movie/:id is a wildcard route.
// that means that :id is going to be stored in...
router.get("/movie/:id", async (req, res, next) => {
  // res.json(req.params.id);
  const movieId = req.params.id;
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  // res.send(thisMovieUrl);
  const fetchedData = await axios.get(thisMovieUrl);

  res.render("single-movie", {
    parsedData: fetchedData.data,
  });
});

router.post("/search", async (req, res, next) => {
  // res.send("Sanity Check!");
  const userSearchTerm = encodeURI(req.body.movieSearch);
  const cat = req.body.cat;
  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;

  const response = await axios.get(movieUrl);
  let parsedData = response.data.results;

  console.log(parsedData);

  if (cat == "person") {
    parsedData = parsedData[0].known_for;
  }

  res.render("index", {
    parsedData,
  });
});

module.exports = router;
