# MongoDB
<a href="https://www.mongodb.com/cloud/atlas/lp/try4?utm_source=google&utm_campaign=gs_apac_south_korea_search_core_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624365&adgroup=115749706703&gclid=CjwKCAjwpKyYBhB7EiwAU2Hn2WH1bCdPjJYlkdQitA_8T9cBH9a1_tO7a4fwRXPOTXw36hJxM_PtxRoCOWgQAvD_BwE">MongoDB</a>

## 왜 데이터베이스를 사용하는가?
1. 데이터베이스는 많은 양의 데이터를 효율적으로 관리하고 저장하는 역할을 합니다.
2. 데이터베이스는 데이터 `CRUD(생성, 읽기, 갱신, 삭제)`를 쉽게 할 수 있는 도구를 제공합니다.
3. 데이터베이스는 데이터를 안전하게 관리할 수 있는 인프라는 제공합니다.
4. 데이터베이스는 유지 보수 및 확장성이 좋습니다.

## SQL VS. NoSQL
`SQL Databases`: 
- Structured Query Language databases are relational databases. We pre-define a schema of tables before we insert anything.
- MySQL, Postres, SQLite, Oracle, Microsoft SQL Server, etc

<img src="https://cdn-images-1.medium.com/max/1000/1*ysKBnRY-U18CmLFd3ehEgA.png" />

`comments` 테이블의 `post_id` 속성이 `posts` 테이블의 `id` 속성을 `참조(referencing)`하고 있는 것을 확인할 수 있습니다.

`NoSQL Databases`: 
- NoSQL databases do not use SQL. There are many types of no-sql databases, including document, key-value, and graph stores.
- MongoDB, CouchDB, Neo4j, Cassandra, Redis, etc
- `NoSQL`은 `SQL`과 달리 `document`, `key-value` 등 다양한 형태 혹은 형식을 가지고 있습니다. 가장 흔하게 쓰는 형태 중 하나는 서버와 클라이언트가 데이터를 주고받을 때 사용하는 `JSON` 혹은 `XML` 형식입니다.
- https://en.wikipedia.org/wiki/Document-oriented_database

```json
[
    {
        "id": 1,
        "author": "Yongsu",
        "text": "papapapa",
        "comments": [
            "aaaaaa",
            "bbbbbb",
            "cccccc"
        ]
    },
    {
        "id": 2,
        "author": "Jeong",
        "text": "mamamamam",
        "comments": "aaaaaaa"
    }
]
```

## MongoDB
<a href="https://www.mongodb.com/cloud/atlas/lp/try4?utm_source=google&utm_campaign=gs_apac_south_korea_search_core_brand_atlas_desktop&utm_term=mongodb&utm_medium=cpc_paid_search&utm_ad=e&utm_ad_campaign_id=12212624365&adgroup=115749706703&gclid=CjwKCAjwpKyYBhB7EiwAU2Hn2bKvKMQg9FgZNyYKc1yCtfVnqJmVTRiq3Vu6Yfjq321vgqpmQpdrvxoCVDoQAvD_BwE">MongoDB</a>

`NoSQL` 형식으로 동작하는 여러 종류의 데이터베이스 중 `MongoDB`를 선택한 이유는 다음과 같습니다.
1. `MongoDB`는 `Node.js and Express.js` 프레임워크에 사용하기 적합합니다. 
2. `MongoDB`는 빠르게 학습해 어떤 결과물을 만들어 내기에 적합합니다.
3. `JavaScript` 언어와 합이 잘 맞습니다.
4. `MongoDB`는 `Express.js` 및 `JavaScript` 기반 서버 프레임워크에서 가장 많이 사용되는 `NoSQL Database`이기 때문에, 다른 데이터베이스에 비교했을 때 커뮤니티가 잘 갖추어져 있고, 자료 또한 많습니다.

- https://www.youtube.com/watch?v=oC6sKlhz0OE&t=8s

```bash
show databases
use animalShelter
db
```

## BSON
<a href="https://www.mongodb.com/json-and-bson">BSON</a>
<a href="https://koonsland.tistory.com/86">BSON Detail</a>

## Inserting with Mongo
<a href="https://www.mongodb.com/docs/manual/core/document/">mongoDB Documentation</a>

```bash
use animalShelter
show collections
db.dogs.find()
db.dogs.insert({ name: "Wyatt", age: 14, breed: "Yongsu", catFriendly: false })
db.dogs.insertMany([{ name: "Hello", age: 2, breed: "World", catFriendly: true}, { name: "World", age: 15, breed: "Hello", catFriendly: false }])
db.dogs.find({})
db.cats.insert({ name: "Blue Steele", age: 6, breed: "yongsu", dogFriendly: false })
db.cats.find({})
```

## Finding with Mongo
- Case-Sensitive
```bash
db.dogs.find({})
db.cats.find({})
db.dogs.find({ breed: "Golden" })
dg.cats.find({ catFriendly: true })
```

## Updating with Mongo
```bash
db.dogs.find({})

db.dogs.updateOne({ name: "charlie"}, { age: 4})
# MongoInvalidArgumentError: Update document requires atomic operators

db.dogs.updateOne({ name: "charlie"}, { $set: { age: 5 }})
db.dogs.find({ name: "charlie" })

db.dogs.updateOne({ name: "charlie"}, { $set: { age: 6, breed: "yongsu" }})
db.dogs.find({ name: "charlie" })

db.dogs.findOne({ name: "charlie" })
db.dogs.updateMany({ catFriendly: true }, { $set: { isAvailable: false }})
db.dogs.find({})

db.cats.find({})
db.cats.updateOne({ age: 6}, { $set: { age: 7}, $currentDate: { lastChanged: true } })
db.cats.findOne()

{
    _id: ObjectId("630b537e9145a465117ac6b"),
    name: "Blue Steele",
    age: 7,
    breed: "yongsu",
    dogFriendly: true,
    lastChanged: ISODate("2022-08-28T11:56:07.828Z")
}
```

## Deleting with Mongo
```bash
db.dogs.find({})
db.dogs.deleteMany({ isAvailable: false })
db.dogs.insert({ asd: 123, aasdas: "aaaaa" })
db.dogs.deleteMany({})
db.dogs.find({})
```

## Additional Mongo Operators
```bash
db.dogs.insertMany([{ name: "Hello", age: 2, breed: "World", catFriendly: true}, { name: "World", age: 15, breed: "Hello", catFriendly: false }])

db.dogs.find({ 'personality.childFriendly': true })
db.dogs.find({ 'personality.childFriendly': true, age: 20 })

db.dogs.find({ age: {$gt: 8}})
db.dogs.find({ age: {$gte: 8}})

db.dogs.find({ age: {$lt: 8}})
db.dogs.find({ age: {$lte: 8}})

db.dogs.find({ breed: { $in: ["Mutt", "Corgi"]}})
db.dogs.find({ breed: { $in: ["Mutt", "Corgi"]}, age: { $lt: 10} })

db.dogs.find({ breed: { $nin: ["Mutt", "Corgi"]}})
db.dogs.find({ $or: [{ 'personality.catFriendly': true}, { age: { $lte: 2}}]})
```