## Mongoose
<a href="https://mongoosejs.com/">Mongoose</a>
<img src="https://cdn-images-1.medium.com/max/1000/1*KIV2bgrXgfkHLiBJFBN6sQ.png" />
`Mongoose`는 `Node.js`와 `MongoDB`를 위한 `ODM(Object Data Mapping)` 라이브러리입니다. `ODM`의 사용은 코드 구성이나 개발 편의성 측면에서 장점이 많습니다. `프로그래밍 언어(Javascript) Object`와 `MongoDB`의 데이터를 `Mapping`하여 호환성을 만들어내고, 간편한 CRUD를 가능하게 합니다. 필요에 따라 확장 및 변경이 가능한 자체 검증(Validation)과 타입 변환(Casting)이 가능하며, Express와 함께 사용하면 MVC 패턴 구현이 용이하다는 장점이 있습니다.

- `MongoDB`는 기본 포트 번호로 `27017`을 가지고 있습니다.
- https://www.mongodb.com/docs/manual/reference/default-mongodb-port/


```javascript
npm init -y
npm install mongoose --save
```

## First Mongoose Model
```javascript
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
```

```javascript
node
.load app.js
amedeus
amedeus.save()
amedeus.score = 9
amedeus.save()
```

```javascript
use test
db.movies.find({})
db.movies.find({})
```

## Insert Many
`InsertMany` 메소드는 `promise`를 리턴합니다. 이를 `resolve`하면 저장된 데이터를 확인할 수 있습니다.
```javascript
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
```

## Finding With Mongoose
- https://mongoosejs.com/docs/api.html#model_Model-find

#### Find
```javascript
// Promise: 모든 documents 찾기
Movie.find({}).then(data => console.log(data));

// Await: 모든 documents 찾기
await Movie.find({}).exec();

// Promise: 이름은 john, 나이는 18세 이상
Movie.find({ name: "john", age: { $gte: 18 }}).then(data => console.log(data));

// Await: 이름은 john, 나이는 18세 이상
await Movie.find({ name: "john", age: { $gte: 18 }}}).exec();

// Callback: 이름은 john, 나이는 18세 이상
await Movie.find({ name: "john", age: { $gte: 18 }}, function (err, docs) {});
```

#### FindOne
- 조건에 최초 매칭되는 값을 리턴합니다.
```javascript
// Promise
Movie.findOne({}).then(data => console.log(data));

// Await
await Movie.findOne({}).exec();

// Callback
Movie.findOne({}, function (err, movie) {});
```

#### FindById
`app.get("/movie/:id")`의 `parameter` 혹은 `wildcard` 방식으로 렌더링 할 때, 데이터의 `_id` 값을 `paramter` 혹은 `wildcard`로 사용하는 경우가 많습니다. 이 경우 `findById` 메소드를 활용해 더욱 효율적으로 데이터를 처리할 수 있습니다.
```javascript
// promise
Movie.findById(id).then(data => console.log(data));

// await
await Movie.findById(id).exec();

// callback
Movie.findById(id, function(err, movie) {});
```

## Updating with Mongoose
```javascript
// Movie.updateOne(업데이트대상 (where), 업데이트내용 (what))
Movie.find({ title: "Amadeus" })
Movie.updateOne({ title: "Amadeus" }, { year: 1984 }).then(res => console.log(res));
Movie.find({ title: "Amadeus" })

Movie.find({ title: { $in: ["Amadeus", "Amelie"]} })
Movie.updateMany({ title: { $in: ['Amadeus', 'Amelie']}}, { score: 10}).then(data => console.log(data))

Movie.find({ title: { $in: ["Amadeus", "Amelie"]} })

// findOneAndUpdate 메소드의 경우 업데이트되기 이전의 값을 리턴합니다.

Movie.findOneAndUpdate({ title: "Amelie" }, { score: 11. 5 }).then(data => console.log(data));

// findOneAndUpdate 메소드의 세 번째 인자인 new 속성은 기본값으로 false로 설정되어 있기 때문에 이전의 갑을 리턴합니다. 이를 true로 변경하면 업데이트된 값을 리턴합니다.
Movie.findOneAndUpdate({ title: "Amelie" }, { score: 20 }, { new: true }).then(data => console.log(data))
```

## Deleting with Mongoose
```javascript
Movie.deleteOne({ title: "Amelie" }).then(msg => console.log(msg));
Movie.deleteMany({ year: { $gte: 1999 }}).then(msg => console.log(msg));
Movie.findOneAndDelete({ title: "Amadeus"}).then(data => console.log(data));
// Promise {
//   <pending>,
//   [Symbol(async_id_symbol)]: 33981,
//   [Symbol(trigger_async_id_symbol)]: 33979,
//   [Symbol(destroyed)]: { destroyed: false }
// }
// > {
//   _id: new ObjectId("630b7030de0f74cbe95dd38d"),
//   title: 'Amadeus',
//   year: 1984,
//   score: 10,
//   rating: 'R',
//   __v: 0
// }
```
## Mongoose Schema Validation
```javascript
// product.js
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/shopApp")
  .then(() => console.log("Connection Open!"))
  .catch((err) => {
    console.log("Connection Failed...");
    console.log("Error: ", err);
  });

// Short-Hand Way
// const productSchema = new mongoose.Schema({
//   name: String,
//   price: Number,
// });

// Longer Way
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
});

const Product = mongoose.model("Product", productSchema);
// const bike = new Product({  price: 599 });
// const bike = new Product({ name: "Mountain Bike", price: "Hello!" });
// const bike = new Product({ name: "Mountain Bike", price: "Hello!", color: "red" });

const bike = new Product({ name: "Mountain Bike", price: 599 });

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

/**
 * show dbs
 * use showApp
 * db.products.find()
 */
```

## Additional Schema Validation
- https://mongoosejs.com/docs/schematypes.html
```javascript
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxlength: 20,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  onSale: {
    type: Boolean,
    default: false,
  },
  categories: [String],
  categories_detail: {
    type: [string],
    default: ["cycling"],
  },
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
});

const Product = mongoose.model("Product", productSchema);
const bike = new Product({
  name: "Mountain Bike",
  price: 599,
  categories: ["Cycling", "Safety"],
});
```
- 값을 갱신하는 경우, `price`값에 음수를 허용하지 않는다고 정의했음에도 불구하고, 음수가 반영되는 것을 확인할 수 있습니다. 
```javascript
Product.findOneAndUpdate(
  { name: "Mountain Bike" },
  { price: -10.99 },
  { new: true }
)
  .then((data) => {
    console.log("IT WORKED!");
    console.log(data);
  })
  .catch((err) => {
    console.log("OH NO ERROR!");
    console.log(err);
  });
```

- 정의한 `Validation` 로직을 그대로 반영하기 위해서는 다음과 같이 `runValidators: true` 설정을 추가해야 합니다.
```javascript
Product.findOneAndUpdate(
  { name: "Mountain Bike" },
  { price: -10.99 },
  { new: true, runValidators: true }
)
  .then((data) => {
    console.log("IT WORKED!");
    console.log(data);
  })
  .catch((err) => {
    console.log("OH NO ERROR!");
    console.log(err);
  });
```

- 오류 메시지를 직접 작성하고 싶은 경우 다음과 같이 스키마를 구성할 수 있습니다.
- `enum:` 잠재적으로 저장될 수 있는 값을 명시하는 역할을 합니다.
```javascript
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
  categories_detail: {
    type: [string],
    default: ["cycling"],
  },
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

const Product = mongoose.model("Product", productSchema);

// "XS" Enum에 명시된 값이 아니기 때문에 오류가 발생합니다.
const bike = new Product({
  name: "Mountain Bike",
  price: 599,
  categories: ["Cycling", "Safety"],
  size: "XS",
});
```

## Model Instance Method
`Mongoose`의 `model`은 `javascript` 클래스와 같은 형태를 띠고 있습니다. 이 말은 즉슨 해당 클래스를 이용해 만든 모든 인스턴스가 접근할 수 있는 메소드가 존재하고, 만약 그 메소드를 필요에 따라 직접 정의할 수 있다면 보다 데이터 생성, 수정, 삭제, 갱신 등에 용이하게 활용할 수 있습니다. `Mongoose`는 `methods`라는 속성값을 통해 직접 메소드를 정의하는 방식을 제공합니다.

- 이 방식에서 눈여겨볼 점은 `this`를 활용해 값에 접근할 수 있다는 점입니다.
```javascript
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

findProduct();
```

## Model Static Methods
`Static Methods`는 정의한 `model`의 인스턴스가 각자의 `this`를 가지고 활용하는 것이 아닌, `model` 그 자체에 정의된 메소드 입니다. 다시 말해서 클래스 그 자체에 정의된 메소드라 생각할 수 있습니다.

`methods` 같은 경우에는 호출한 하나의 인스턴스에 어떤 변화를 주는 것이라면, `static` 같은 경우 해당 모델에 해당하는 모든 요소에 변화를 주고 싶은 경우 유용하게 사용할 수 있습니다.
```javascript
productSchema.statics.fireSale = function () {
  return this.updateMany({}, { onSale: true, price: 0 });
};

const Product = mongoose.model("Product", productSchema);
Product.fireSale().then((res) => console.log(res));
```

## Mongoose Virtuals
`virtual`은 마치 해당 모델의 프로퍼티 인 것처럼 동작합니다. 그럼에도 DB에는 저장되지 않는 마치 가상으로 존재하는 요소처럼 동작하기 때문에 `virtual`이라는 이름으로 사용합니다.

`GET`: 프로퍼티 처럼 접근하는 경우 get 메소드에 명시한 값이 리턴되고

`SET`: 변수에 할당하듯이 프로퍼티에 접근하는 경우 set 메소드이 명시한 로직이 실행됩니다.

```javascript
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/people")
  .then(() => console.log("Connection Open!"))
  .catch((err) => {
    console.log("Connection Failed...");
    console.log("Error: ", err);
  });

const personSchema = new mongoose.Schema({
  first: String,
  last: String,
});

personSchema
  .virtual("fullName")
  .get(function () {
    return `${this.first} ${this.last}`;
  })
  .set(function (v) {
    this.name.first = v.substr(0, v.indexOf(" "));
    this.name.last = v.substr(v.indexOf(" ") + 1);
  });

const Person = mongoose.model("Person", personSchema);
const tammy = new Person({ first: "Tammy", last: "Chow" });
console.log(tammy.fullName);
tammy.save();
console.log(tammy.fullName);
tammy.fullName = "Tammy Xiao";

/**
 * show colletions
 * db.people.find()
 */
```

## Mongoose Middleware
- https://mongoosejs.com/docs/middleware.html
`mongoose`는 내부적으로 코드 실행 전과 후에 실행할 수 있는 미들웨어를 제공합니다.
- Ex) `save` 메소드 호출 전 혹은 호출 후

```javascript
personSchema.pre("save", async function () {
  // 이 예시는 참고용으로 절대 이렇게 해서는 안 됩니다!!!
  this.first = "YO";
  this.last = "HO";
  console.log("About To Save!!!");
});

personSchema.post("save", async function () {
  console.log("Just Save!!");
});

const yongsu = new Person({ first: "Yongsu", last: "Jeong" });
yongsu.save().then(p => console.log(p));
```