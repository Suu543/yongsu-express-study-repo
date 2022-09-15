# Campgrounds CRUD

## Basic Setup
```bash
npm install express mongoose ejs 
mkdir views
cd views 
touch home.ejs
```

```javascript
// app.js
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/campground", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected...");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/makecampground", async (req, res) => {
  const camp = new Campground({
    title: "My Backyard",
    description: "Cheap Camping",
  });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log("Listening to port 3000...");
});
```

```html
<!-- views/home.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Home</title>
  </head>
  <body>
    <h1>Welcome to Campground</h1>
  </body>
</html>
```

```javascript
// models/campground.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CampGroundSchema = new Schema({
  title: String,
  price: String,
  description: String,
  location: String,
});

module.exports = mongoose.model("Campground", CampGroundSchema);
```

```bash
# testcase
node app.js
show dbs
use campground
db.campgrounds.find({})
```

```javascript
// seeds/cities 데이터 참조
// seeds/seedHelpers.js
module.exports.descriptors = [
  "Forest",
  "Ancient",
  "Petrified",
  "Roaring",
  "Cascade",
  "Tumbling",
  "Silent",
  "Redwood",
  "Bullfrog",
  "Maple",
  "Misty",
  "Elk",
  "Grizzly",
  "Ocean",
  "Sea",
  "Sky",
  "Dusty",
  "Diamond",
];

module.exports.places = [
  "Flats",
  "Village",
  "Canyon",
  "Pond",
  "Group Camp",
  "Horse Camp",
  "Ghost Town",
  "Camp",
  "Dispersed Camp",
  "Backcountry",
  "River",
  "Creek",
  "Creekside",
  "Bay",
  "Spring",
  "Bayshore",
  "Sands",
  "Mule Camp",
  "Hunting Camp",
  "Cliffs",
  "Hollow",
];
```

```javascript
// seeds/index.js
const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose.connect("mongodb://localhost:27017/campground", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});

  for (let i = 0; i < 50; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const camp = new Campground({
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
```

## Campground Index
```javascript
// app.js
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/campground", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected...");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.listen(3000, () => {
  console.log("Listening to port 3000...");
});
```

```html
<!-- campgrounds/index.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Campgrounds</title>
  </head>
  <body>
    <h1>All Campgrounds</h1>
    <ul>
      <% for (let campground of campgrounds) { %>
      <li><%= campground.title %></li>
      <% } %>
    </ul>
  </body>
</html>
```

## Campground Show

```html
<!-- campgrounds/show.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Show</title>
  </head>
  <body>
    <h1><%= campground.title %></h1>
    <h2><%= campground.location %></h2>
  </body>
</html>
```

```javascript
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/campground", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected...");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.listen(3000, () => {
  console.log("Listening to port 3000...");
});
```

## Campground New & Create
```html
<!-- index.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Campgrounds</title>
  </head>
  <body>
    <h1>All Campgrounds</h1>
    <div>
      <a href="/">Add Campground</a>
    </div>

    <ul>
      <% for (let campground of campgrounds) { %>
      <li>
        <a href="/campgrounds/<%= campground._id %>"><%= campground.title %></a>
      </li>
      <% } %>
    </ul>
  </body>
</html>
```

```html
<!-- new.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Campground</title>
  </head>
  <body>
    <form action="/campgrounds" methods="POST">
      <div>
        <label for="title">Title</label>
        <input type="text" id="title" name="campground[title]" />
      </div>
      <div>
        <label for="location">Location</label>
        <input type="text" id="location" name="campground[location" />
      </div>
      <button>Add Campground</button>
      <a href="/">All Campgrounds</a>
    </form>
  </body>
</html>
```

```html
<!-- show.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Show</title>
  </head>
  <body>
    <h1><%= campground.title %></h1>
    <h2><%= campground.location %></h2>
    <footer>
      <a href="/campgrounds">All Campgrounds</a>
    </footer>
  </body>
</html>
```

```javascript
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/campground", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected...");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.listen(3000, () => {
  console.log("Listening to port 3000...");
});
```

## Campground Edit & Update
```javascript
// app.js
const path = require("path");
const mongoose = require("mongoose");
const express = require("express");
const methodOverride = require("method-override");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/campground", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("Database Connected...");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/campgrounds", async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
});

app.get("/campgrounds/new", (req, res) => {
  res.render("campgrounds/new");
});

app.post("/campgrounds", async (req, res) => {
  const campground = new Campground(req.body.campground);
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
});

app.get("/campgrounds/:id", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  });
  res.redirect(`/campgrounds/${campground._id}`);
});

app.listen(3000, () => {
  console.log("Listening to port 3000...");
});
```

```html
<!-- edit.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Edit Campground</title>
  </head>
  <body>
    <h1>Edit Campground</h1>

    <form action="/campgrounds/<%= campground._id %>?_method=PUT" method="POST">
      <div>
        <label for="title">Title</label>
        <input
          type="text"
          id="title"
          name="campground[title]"
          value="<%= campground.title %>"
        />
      </div>
      <div>
        <label for="location">Location</label>
        <input
          type="text"
          id="location"
          name="campground[location]"
          value="<%= campground.location %>"
        />
      </div>
      <button>Update Campground</button>
    </form>
    <a href="/campgrounds/<%= campground._id %>">Back to Campgrounds</a>
  </body>
</html>
```

```html
<!-- show.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Show</title>
  </head>
  <body>
    <h1><%= campground.title %></h1>
    <h2><%= campground.location %></h2>
    <p><a href="/campgrounds/<%= campground._id %>/edit">Edit</a></p>
    <footer>
      <a href="/campgrounds">All Campgrounds</a>
    </footer>
  </body>
</html>
```

## Campground Delete
```html
<!-- show.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Show</title>
  </head>
  <body>
    <h1><%= campground.title %></h1>
    <h2><%= campground.location %></h2>
    <p>
      <a href="/campgrounds/<%= campground._id %>/edit">Edit</a>
    </p>
    <p>
        <form action="/campgrounds/<%= campground._id %>?_method=DELETE" method="POST">
            <button>Delete</button>
        </form>
    </p>
    <footer>
      <a href="/campgrounds">All Campgrounds</a>
    </footer>
  </body>
</html>
```

```javascript
app.delete("/campgrounds/:id", async (req, res) => {
  const { id } = req.params;
  await Campground.findByIdAndDelete(id);
  res.redirect("/campgrounds");
});
```