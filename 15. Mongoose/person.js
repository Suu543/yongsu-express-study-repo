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

// mongoose middleware
personSchema.pre("save", async function () {
  this.first = "YO";
  this.last = "HO";
  console.log("About To Save!!!");
});

personSchema.post("save", async function () {
  console.log("Just Save!!");
});

const Person = mongoose.model("Person", personSchema);
const tammy = new Person({ first: "Tammy", last: "Chow" });
console.log(tammy.fullName);
tammy.save();
console.log(tammy.fullName);
tammy.fullName = "Tammy Xiao";
