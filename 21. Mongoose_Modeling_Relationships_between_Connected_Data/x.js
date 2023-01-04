// Course, Author,

// Trade off between query performance vs consistency

// Using References (Normalization) ==> Consistency
// 다음과 같이 정의하고, 내일 name을 변경하고 싶은 경우 한 부분만 변경하면된다.
let author = {
  name: "Yongsu",
};

let course = {
  author: "id",
  authors: ["id1", "id2"],
};

// Using Embedded Documents (Denormalization) ==> Performance
// 다음과 같이 정의하고, 내일 name을 변경하고 싶은 경우 다수의 course를 업데이트 해야 한다는 문제가 발생합니다.
let course = {
  author: {
    name: "Yongsu",
  },
};

// Hybrid
let author = {
  name: "Yongsu",
  // 50 other properties
};

let course = {
  author: {
    id: "ref",
    name: "yongsu",
  },
};
