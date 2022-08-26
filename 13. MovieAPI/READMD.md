# MovieAPI Project

```javascript
// API Key: 1fb720b97cc13e580c2c35e1138f90f8

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';
```

## Adding Axios Module
```javascript
// app.js
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const helmet = require("helmet");
const dotenv = require("dotenv");

const indexRouter = require("./routes/index");

const app = express();
const PORT = process.env.PORT || 3000;
dotenv.config();

app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use("/", indexRouter);

app.listen(PORT || 3000, () => {
  console.log(`Listening on port ${PORT}`);
});
```

```javascript
// routes/index.js
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
  const response = await axios.get(nowPlayingUrl);
  const fetchedData = response.data;
  // res.json(parsedData);

  res.render("index", {
    parsedData: fetchedData.results,
  });
});

module.exports = router;
```

```javascript
// index.ejs
// index.ejs
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Movie App</title>
    <%- include("head") %>
  </head>

  <body>
    <%- include("navbar") %>
    <div class="movie-container">
      <div class="movie-label">
        <h1>Now Playing</h1>
      </div>
      <div class="movie-row">
        <% parsedData.forEach((movie) => { %>
        <div class="movie-card">
          <img
            src="<%= imageBaseUrl + movie.poster_path %>"
            alt="<%= `${movie.title} movie poster` %>"
          />
        </div>
        <% }) %>
      </div>
    </div>
  </body>
</html>
```

## Adding the single-movie view
- https://developers.themoviedb.org/3/movies/get-movie-details

```javascript
// routes/index.js
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

  const parsedData = await axios.get(thisMovieUrl);

  res.render("single-movie", {
    parsedData,
  });
});

module.exports = router;
```

```javascript
// views/single-movie.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Single Movie</title>
    <%- include("head") %>
  </head>
  <body>
    <%- include("navbar") %>
    <div class="single-movie-container">
      <div class="single-movie-row">
        <h1 class="single-movie-title"><%= parsedData.title %></h1>
        <h3 class="single-movie-tagline"><%= parsedData.tagline %></h3>
        <img src="<%= imageBaseUrl + parsedData.poster_path %>" />

        <p class="single-movie-overview">
          Movie Synopsis: <br />
          <span> <%= parsedData.overview %> </span>
        </p>

        <div id="detail" class="single-movie-detail">
          <button id="single-movie-open">More Detail</button>
        </div>
      </div>
    </div>

    <div class="single-movie-modal fade">
      <div class="single-movie-content">
        <div class="single-movie-modal__header">
          <h3>Movie Information</h3>
        </div>
        <div class="single-movie-modal__body">
          <a
            href="https://www.imdb.com/title/<%= parsedData.imdb_id %>"
            target="_blank"
            >IMDB Link</a
          >
          <p><%= parsedData.budget %></p>
          <p><%= parsedData.revenue %></p>
          <p><%= parsedData.release_date %></p>
          <ul>
            <% parsedData.production_companies.forEach((company) => { %>
            <li><%= company.name %></li>
            <% }) %>
          </ul>
        </div>
        <div class="single-movie-btn">
          <button id="single-movie-close">Close</button>
        </div>
      </div>
    </div>
    <script src="/javascript/modal.js"></script>
  </body>
</html>
```

```css
// stylesheets/styles.css
body {
  padding: 10px;
  font: 14px "Lucida Grande", Helvetica, Arial, sans-serif;
}

a {
  color: #00b7ff;
}

.navbar-right {
  margin-right: 10px;
}

.poster img {
  width: 90%;
  text-align: center;
  margin: 10px 5% 10px;
}

#search-form input {
  margin: 8px 0px;
  padding: 5px;
}

.form-group select {
  min-width: 150px;
}

.single-movie-title,
.overview-header {
  font-family: "Metamorphous", cursive;
}

.overview-header {
  font-size: 20px;
  font-weight: bold;
}

.single-movie-overview {
  font-family: "Swanky and Moo Moo", cursive;
  font-size: 24px;
  font-weight: normal;
}

.movie-container {
  width: 90%;
  margin: auto;
}

.movie-label {
  width: 90%;
  margin: auto;
  text-align: center;
  margin-top: 2rem;
}

.movie-label h1 {
  font-weight: bold;
  font-size: 3rem;
}

.movie-row {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: auto;
  margin-top: 2rem;
  flex-wrap: wrap;
  gap: 2rem;
}

.movie-card {
  flex: 1 1 20rem;
  text-align: center;
}

.movie-card img {
  width: 100%;
}

/* Single Movie */
.single-movie-container {
  width: 90%;
  margin: auto;
}

.single-movie-row {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.single-movie-overview {
  width: 50%;
  margin: auto;
  font-family: "Times New Roman", Times, serif;
  text-align: center;
}

.single-movie-detail button {
  border: none;
  padding: 1rem 2rem;
  background-color: #2f6cb1;
  color: white;
  font-size: 1.2rem;
  border-radius: 4%;
}

/* single-movie-modal */
.single-movie-modal {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: rgba(148, 148, 148, 0.8);
}

.single-movie-content {
  position: relative;
  top: 20vh;
  left: 35vw;
  width: 30%;
  min-height: 35vh;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  border-radius: 3%;
  padding-left: 4rem;
  gap: 1rem;
}

.single-movie-btn {
  display: flex;
  width: 90%;
  justify-content: center;
}

.single-movie-content button {
  padding: 0.5rem 1.3rem;
  border: none;
  color: white;
  background-color: red;
  border-radius: 6%;
}

.fade {
  display: none;
}
```

```javascript
// javascript/modal.js
// javascript/modal.js
const modal = document.querySelector(".single-movie-modal");
const openBtn = document.getElementById("single-movie-open");
const closeBtn = document.getElementById("single-movie-close");

function displayModal() {
  modal.classList.toggle("fade");
}

openBtn.addEventListener("click", displayModal);
closeBtn.addEventListener("click", displayModal);
```

## Adding the search feature
- https://developers.themoviedb.org/3/search/search-movies
- https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI

```javascript
// query
// string
// Pass a text query to search. This value should be URI encoded.

// minLength: 1
// require
```

```javascript
// routes/index.js
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
```

```javascript
// navbar.ejs
<!-- navbar.ejs -->
<nav class="navbar navbar-expand-lg navbar-light bg-light">
  <div class="container-fluid">
    <button
      class="navbar-toggler"
      type="button"
      data-bs-toggle="collapse"
      data-bs-target="#navbarTogglerDemo03"
      aria-controls="navbarTogglerDemo03"
      aria-expanded="false"
      aria-label="Toggle navigation"
    >
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand" href="/">The New IMDB</a>
    <div class="collapse navbar-collapse" id="navbarTogglerDemo03">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <a class="nav-link active" aria-current="page" href="/login">Login</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="/favorites">Favorites</a>
        </li>
      </ul>
      <form
        class="d-flex"
        action="/search?source=hp"
        method="POST"
        id=""
        search-form
      >
        <div class="form-group">
          <select name="cat" class="form-control" id="cat">
            <option value="movie">Movie Title</option>
            <option value="person">Actor</option>
          </select>
        </div>

        <input
          class="form-control me-2"
          type="search"
          placeholder="Search"
          aria-label="Search"
          name="movieSearch"
        />
        <button class="btn btn-outline-success" type="submit">Submit</button>
      </form>
    </div>
  </div>
</nav>
```