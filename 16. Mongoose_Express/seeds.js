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
