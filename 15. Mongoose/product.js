const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/shopApp")
  .then(() => console.log("Connection Open!"))
  .catch((err) => {
    console.log("Connection Failed...");
    console.log("Error: ", err);
  });

// Longer Way
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price must be positive!"],
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  categories: [String],
  qty: {
    online: {
      type: Number,
      default: 0,
    },
    inStore: {
      type: Number,
      default: 0,
    },
  },
  size: {
    type: String,
    enum: ["S", "M", "L"],
  },
});

// Traditional Function 사용을 추천함
productSchema.methods.greet = function () {
  console.log("Hello!!! Hi!!!");
  console.log(`- from ${this.name}`);
};

productSchema.methods.toggleOnSale = function () {
  this.onSale = !this.onSale;
  return this.save();
};

productSchema.methods.addCategory = function (newCat) {
  this.categories.push(newCat);
  return this.save();
};

productSchema.statics.fireSale = function () {
  return this.updateMany({}, { onSale: true, price: 0 });
};

const Product = mongoose.model("Product", productSchema);

const findProduct = async () => {
  foundProduct.greet();
  const foundProduct = await Product.findOne({ name: "Bike Helmet" });
  console.log(foundProduct);
  await foundProduct.toggleOnSale();
  console.log(foundProduct);
  await foundProduct.addCategory("Outdoors");
  console.log(foundProduct);
};

// findProduct();

Product.fireSale().then((res) => console.log(res));

const bike = new Product({
  name: "Mountain Bike",
  price: 599,
  categories: ["Cycling", "Safety"],
  size: "XS",
});

bike
  .save()
  .then((data) => {
    console.log("IT WORKED!");
    console.log(data);
  })
  .catch((err) => {
    console.log("OH NO ERROR!");
    console.log(err);
    console.log(err.error);
    console.log(err.error.name);
    console.log(err.error.name.properties.message);
  });

const p = new Product({ name: "bike bag", price: 10 });
p.greet();

/**
 * show dbs
 * use showApp
 * db.products.find()
 */
