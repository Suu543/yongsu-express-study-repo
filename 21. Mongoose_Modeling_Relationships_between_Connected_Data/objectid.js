//  _id: 5a2131315421551512512512
// 12 bytes = Unique Identified Document in MongoDB
// - 4 bytes: timestamp
// - 3 bytes: machine identifier
// - 2 bytes: process identifier
// - 3 bytes: counter (ex: Auto-Incrementing Number)

// 1 bytes = 8 bits
// - 2 ^ 8 = 256
// - 2 ^ 24 = 16M (이상인 경우 counter overflow 발생)

// SQL 방식은 이전 데이터를 기준으로 +1 하는 방식이기 때문에 unique identifier 방식의 구현이 가능하지만,
// 일일이 생성해야 하므로 어느 정도 시간이 소요됩니다.
// MongoDB는 12 bytes를 사용해 바로 생성하고,
// MongoDB는 SQL처럼 central place와 소통할 필요가 없어서 확장성이 좋고 속도가 빠릅니다.

// ID를 직접 생성하는 법
const mongoose = require("mongoose");
const id = new mongoose.Types.ObjectId();
console.log(id);
console.log(id.getTimestamp()); // First 4 bytes

// 유효한 mongoDB ID인지 검증하는 법
const isValid = mongoose.Types.ObjectId.isValid("1234");
console.log(isValid);
