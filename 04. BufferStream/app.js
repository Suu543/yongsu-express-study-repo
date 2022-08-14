const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("Async Operation 1...");
    resolve(1);
  }, 2000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("Asnyc Operation 2...");
    resolve(2);
  }, 1000);
});

Promise.race([p1, p2])
  .then((result) => console.log(result))
  .catch((err) => console.log("Error", err.message));
