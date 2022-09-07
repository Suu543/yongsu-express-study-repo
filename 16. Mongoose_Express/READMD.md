# Express + Mongoose Setup
```javascript
npm install express ejs mongoose
touch index.js
mkdir views
```

```javascript
// index.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("ON NO MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/dog", (req, res) => {
  res.send("WOOF!!");
});

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});
```

## Creating Model
```javascript
// index.js
const express = require("express");
const path = require("path");
const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/dog", (req, res) => {
  res.send("WOOF!!");
});

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});
```

```javascript
// models/product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  price: {
    type: Number,
    required: true,
    min: 0,
  },

  category: {
    type: String,
    lowercase: true,
    enum: ["fruit", "vegetable", "dairy"],
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
```

```javascript
// seeds.js
const mongoose = require("mongoose");
const Product = require("./models/product");

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("ON NO MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

// const p = new Product({
//   name: "Ruby Grapes",
//   price: 1.99,
//   category: "fruit",
// });

// p.save()
//   .then((p) => {
//     console.log(p);
//   })
//   .catch((e) => console.log(e));

const seedProducts = [
  {
    name: "Fairy Eggplant",
    price: 1.0,
    category: "vegetable",
  },
  {
    name: "Carrot",
    price: 4.99,
    category: "vegetable",
  },
  {
    name: "Orange",
    price: 2.99,
    category: "fruit",
  },
  {
    name: "Cucember",
    price: 9.99,
    category: "vegetable",
  },
];

Product.insertMany(seedProducts)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.log(err);
  });
```

```javascript
node seeds.js
show dbs
use farmStand
show collections
db.products.find()
```

## Products Index
```javascript
// index.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./models/product");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("ON NO MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  console.log(products);
  //   res.send("ALL PRODUCTS WILL BE HERE...");
  res.render("products/index", { products });
});

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});
```

```javascript
// views/products/index.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>All Products</title>
  </head>
  <body>
    <h1>All Products!!!</h1>
    <ul>
      <% for(let product of products){ %>
      <li><%= product.name %></li>
      <% } %>
    </ul>
  </body>
</html>
```

## Product Details
```javascript
// index.js
app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product);
  //   res.send("Detail Page!");
  res.render("products/show", { product });
});
```

```html
// index.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>All Products</title>
  </head>
  <body>
    <h1>All Products!!!</h1>
    <ul>
      <% for(let product of products){ %>
      <li>
        <a href="/products/<%=product._id %>"><%= product.name %> </a>
      </li>
      <% } %>
    </ul>
  </body>
</html>
```

```html
// show.ejs
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= product.name %></title>
  </head>
  <body>
    <h1><%= product.name %></h1>
    <ul>
      <li>Price: <%= product.price %></li>
      <li>Category: <%= product.category %></li>
    </ul>
    <a href="/products">All Products</a>
  </body>
</html>
```

## Creating Products
```javascript
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const Product = require("./models/product");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("ON NO MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  console.log(products);
  //   res.send("ALL PRODUCTS WILL BE HERE...");
  res.render("products/index", { products });
});

app.get("/products/new", (req, res) => {
  res.render("products/new");
});

app.post("/products", async (req, res) => {
  //   console.log(req.body);
  //   res.send("Make Your Product");
  //   const newProduct = new Product(req.body);
  //   console.log(newProduct);
  //   await newProduct.save();

  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect(`/products/${newProduct._id}`);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product);
  //   res.send("Detail Page!");
  res.render("products/show", { product });
});

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});
```

```html
<!-- products/new.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Product</title>
  </head>
  <body>
    <h1>Add A Product</h1>
    <form action="/products" method="POST">
      <label for="name">Product Name</label>
      <input type="text" name="name" placeholder="product name" />

      <label for="price">Price (Unit)</label>
      <input type="number" name="price" id="price" placeholder="price" />

      <label for="category" id="category">Select Category</label>
      <select name="category" id="category">
        <option value="fruit">fruit</option>
        <option value="vegetable">vegetable</option>
        <option value="dairy">dairy</option>
      </select>

      <button>Submit</button>
    </form>
  </body>
</html>
```

## Updating Products
```javascript
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Product = require("./models/product");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("ON NO MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/products", async (req, res) => {
  const products = await Product.find({});
  console.log(products);
  //   res.send("ALL PRODUCTS WILL BE HERE...");
  res.render("products/index", { products });
});

app.get("/products/new", (req, res) => {
  res.render("products/new");
});

app.post("/products", async (req, res) => {
  //   console.log(req.body);
  //   res.send("Make Your Product");
  //   const newProduct = new Product(req.body);
  //   console.log(newProduct);
  //   await newProduct.save();

  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect(`/products/${newProduct._id}`);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product);
  //   res.send("Detail Page!");
  res.render("products/show", { product });
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product });
});

app.put("/products/:id", async (req, res) => {
  // console.log(req.body);
  // res.send("PUT")

  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/products/${product._id}`);
});

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});
```

```html
<!-- products/edit.js -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Edit Product</title>
  </head>
  <body>
    <h1>Edit Product</h1>
    <form action="/products/<%=product._id %>?_method=PUT" method="POST">
      <label for="name">Product Name</label>
      <input
        type="text"
        name="name"
        placeholder="product name"
        value="<%=product.name%>"
      />

      <label for="price">Price (Unit)</label>
      <input
        type="number"
        name="price"
        id="price"
        placeholder="price"
        value="<%=product.price%>"
      />

      <label for="category" id="category">Select Category</label>
      <select name="category" id="category">
        <option value="fruit">fruit</option>
        <option value="vegetable">vegetable</option>
        <option value="dairy">dairy</option>
      </select>

      <button>Submit</button>
    </form>

    <a href="/products/<%=product._id%>">Cancel</a>
  </body>
</html>
```

```html
<!-- products/show.ejs  -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= product.name %></title>
  </head>
  <body>
    <h1><%= product.name %></h1>
    <ul>
      <li>Price: <%= product.price %></li>
      <li>Category: <%= product.category %></li>
    </ul>
    <a href="/products">All Products</a>
    <a href="/products/<%=product._id%>/edit">Edit Product</a>
  </body>
</html>
```

## Tangent On Category Selector
```html
<!-- products/edit.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Edit Product</title>
  </head>
  <body>
    <h1>Edit Product</h1>
    <form action="/products/<%=product._id %>?_method=PUT" method="POST">
      <label for="name">Product Name</label>
      <input
        type="text"
        name="name"
        placeholder="product name"
        value="<%=product.name%>"
      />

      <label for="price">Price (Unit)</label>
      <input
        type="number"
        name="price"
        id="price"
        placeholder="price"
        value="<%=product.price%>"
      />

      <label for="category" id="category">Select Category</label>
      <select name="category" id="category">
        <option value="fruit" <%=product.category === 'fruit' ? 'selected' : '' %>>fruit</option>
        <option value="vegetable" <%=product.category === 'vegetable' ? 'selected' : '' %>>vegetable</option>
        <option value="dairy" <%=product.category === 'dairy' ? 'selected' : '' %>>dairy</option>
      </select>

      <button>Submit</button>
    </form>

    <a href="/products/<%=product._id%>">Cancel</a>
  </body>
</html>
```

```javascript
// index.js
// 동적으로 category가 추가된다는 장점이 있습니다.
const categories = ["fruit", "vegetable", "dairy"];

app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});
```

```html
<!-- products/new.ejs  before -->
<select name="category" id="category">
    <option value="fruit">fruit</option>
    <option value="vegetable">vegetable</option>
    <option value="dairy">dairy</option>
</select>

<!-- products/new.ejs  after -->
<select name="category" id="category">
    <% for(let category of categories) { %>
    <option value="<%=category %>"><%=category%></option>
    <% } %>
</select>

<!-- products/edit.ejs  before -->
<select name="category" id="category">
    <option value="fruit" <%=product.category === 'fruit' ? 'selected' : '' %>>fruit</option>
    <option value="vegetable" <%=product.category === 'vegetable' ? 'selected' : '' %>>vegetable</option>
    <option value="dairy" <%=product.category === 'dairy' ? 'selected' : '' %>>dairy</option>
</select>

<!-- products/edit.ejs  after -->
<select name="category" id="category">
    <% for(let category of categories) { %>
    <option value="<%=category %>" <%= product.category === category ? 'selected' : ""  %>><%=category%></option>
    <% } %>
</select>
```

```html
<!-- products/index.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>All Products</title>
  </head>
  <body>
    <h1>All Products!!!</h1>
    <ul>
      <% for(let product of products){ %>
      <li>
        <a href="/products/<%=product._id %>"><%= product.name %> </a>
      </li>
      <% } %>
    </ul>

    <a href="/products/new">New Product</a>
  </body>
</html>
```

## Deleting Products
```javascript
// index.js
app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  res.redirect("/products");
});
```

```html
<!-- products/show.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= product.name %></title>
  </head>
  <body>
    <h1><%= product.name %></h1>
    <ul>
      <li>Price: <%= product.price %></li>
      <li>Category: <%= product.category %></li>
    </ul>
    <a href="/products">All Products</a>
    <a href="/products/<%=product._id%>/edit">Edit Product</a>
    <form action="/products/<%=product._id%>?_method=DELETE" method="POST">
      <button>DELETE</button>
    </form>
  </body>
</html>
```

## Filtering By Category
- /categories/dairy
- /products?category=dairy

```javascript
// index.js
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const Product = require("./models/product");
const app = express();

mongoose
  .connect("mongodb://localhost:27017/farmStand", {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("ON NO MONGO CONNECTION ERROR!!!");
    console.log(err);
  });

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const categories = ["fruit", "vegetable", "dairy"];

app.get("/products", async (req, res) => {
  const { category } = req.query;
  console.log(category);
  if (category) {
    console.log(category);
    const products = await Product.find({ category });
    res.render("products/index", { products, category });
  } else {
    console.log(category);
    const products = await Product.find({});
    res.render("products/index", { products, category: "All" });
  }
});

app.get("/products/new", (req, res) => {
  res.render("products/new", { categories });
});

app.post("/products", async (req, res) => {
  //   console.log(req.body);
  //   res.send("Make Your Product");
  //   const newProduct = new Product(req.body);
  //   console.log(newProduct);
  //   await newProduct.save();

  const newProduct = new Product(req.body);
  await newProduct.save();
  res.redirect(`/products/${newProduct._id}`);
});

app.get("/products/:id", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  console.log(product);
  //   res.send("Detail Page!");
  res.render("products/show", { product });
});

app.get("/products/:id/edit", async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  res.render("products/edit", { product, categories });
});

app.put("/products/:id", async (req, res) => {
  // console.log(req.body);
  // res.send("PUT")

  const { id } = req.params;
  const product = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/products/${product._id}`);
});

app.delete("/products/:id", async (req, res) => {
  const { id } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(id);
  res.redirect("/products");
});

app.listen(3000, () => {
  console.log("App is listening on port 3000...");
});
```

```html
<!-- products/show.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title><%= product.name %></title>
  </head>
  <body>
    <h1><%= product.name %></h1>
    <ul>
      <li>Price: <%= product.price %></li>
      <li>
        Category:
        <a href="/products?category=<%= product.category %>"
          ><%= product.category %></a
        >
      </li>
    </ul>
    <a href="/products">All Products</a>
    <a href="/products/<%=product._id%>/edit">Edit Product</a>
    <form action="/products/<%=product._id%>?_method=DELETE" method="POST">
      <button>DELETE</button>
    </form>
  </body>
</html>
```

```html
<!-- products/index.ejs -->
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>All Products</title>
  </head>
  <body>
    <h1><%= category %> Products!</h1>
    <ul>
      <% for(let product of products){ %>
      <li>
        <a href="/products/<%=product._id %>"><%= product.name %> </a>
      </li>
      <% } %>
    </ul>

    <a href="/products/new">New Product</a>
    <%if(category !== 'All'){ %>
    <a href="/products">All Products</a>
    <% } %>
  </body>
</html>
```