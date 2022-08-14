# JavaScript Engine, Heap, and Call Stack
<img src="https://res.cloudinary.com/practicaldev/image/fetch/s--dM0jXped--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/i/agxpgg948lpni5rs5kos.png" width="1000" height="420" style="background-color:#dddddd;" class="crayons-article__cover__image" alt="Cover image for How JavaScript Works: An Overview of JavaScript Engine, Heap, and Call Stack">

**JavaScript Engine**: `JS Engine`은 `JS` 코드를 실행시키는 프로그램입니다. 크롬에서 사용하는 `V8` 엔진은 가장 유명한 `JS Engine` 중 하나 입니다.

**V8 Engine**: `V8 Engein`은 오픈소스 프로젝트로써 높은 성능을 제공하는 엔진입니다. 이 엔진은 `C++`로 작성된 `웹 어셈블리 엔진 (Web Assembly Engine)`입니다.

<a href="https://res.cloudinary.com/practicaldev/image/fetch/s--At7SNf7o--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588100487/V8%2520Engine/pkm3gblxjo6dvxn6cs59.png" class="article-body-image-wrapper"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--At7SNf7o--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588100487/V8%2520Engine/pkm3gblxjo6dvxn6cs59.png" alt="" loading="lazy"></a>

## Call Stack
`JavaScript`는 `single-theaded programinng(싱글 쓰레드)` 방식으로 동작하는 언어입니다. 이는 한 번에 하나의 작업을 수행할 수 있고, 자세하게는 하나의 `Call Stack`을 가지고 있습니다.

<a href="https://res.cloudinary.com/practicaldev/image/fetch/s--WCaqXjKk--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588169496/V8%2520Engine/ksbkcvxzxokwflc2ecvt.png" class="article-body-image-wrapper"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--WCaqXjKk--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588169496/V8%2520Engine/ksbkcvxzxokwflc2ecvt.png" alt="" loading="lazy"></a>

```javascript
function one() {
    return 1;
}

function two() {
    return one() + 1;
}

function three() {
    return two() + 1;
}

three();
```
<a href="https://res.cloudinary.com/practicaldev/image/fetch/s--1CLjgDMe--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588091277/V8%2520Engine/v0rlrajikz1hdhduswca.gif" class="article-body-image-wrapper"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--1CLjgDMe--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588091277/V8%2520Engine/v0rlrajikz1hdhduswca.gif" alt="call stack Visualization" loading="lazy"></a>

```javascript
function one() {
    // throws an error
    throw new Error("Whoops!");
}

function two() {
    return one() + 1;
}

function three() {
    return two() + 1;
}

three();
```

<a href="https://res.cloudinary.com/practicaldev/image/fetch/s--1x24eqLx--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588091275/V8%2520Engine/cq37yxj9m3t6v59bysvi.gif" class="article-body-image-wrapper"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--1x24eqLx--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588091275/V8%2520Engine/cq37yxj9m3t6v59bysvi.gif" alt="Call Stack Visualization" loading="lazy"></a>

- `V8 Engine`엔진에 오류가 발생하면 `스택 추적(stack trace)`을 출력합니다. `스택 추적(stack trace)`는 기본적으로 `Call Stack`의 현 상태를 의미합니다.

- `재귀(Recursion)` 예시를 통해 `Call Stack` 에러를 확인할 수 있습니다.

```javascript
function recursion() {
    recursion();
}

recursion();
```

<a href="https://res.cloudinary.com/practicaldev/image/fetch/s--g6DRw5-p--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588091427/V8%2520Engine/etevycrnjmom6vw6inwb.gif" class="article-body-image-wrapper"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--g6DRw5-p--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588091427/V8%2520Engine/etevycrnjmom6vw6inwb.gif" alt="call stack Visualization" loading="lazy"></a>

**Web APIs**: `Web API`를 호출하면 별도의 `Web API`에 해당하는 함수를 처리하는 별도의 `Call Stack`이 하나 더 생성됩니다. 이는 일반적으로 `DOM`요소의 이벤트 처리, `HTTP 요청`, `timer` 등에 사용됩니다. `Web API`와 관련된 작업이 끝나면, `Callback Queue`로 콜백 함수가 전달됩니다.
- DOM
- AJAX (XMLHttpRequest)
- setImmediate
- setTimeout
- setInterval

**Callback Queue**: `Callback Queue`는 `FIFO(First Input First Out)` 방식으로 동작합니다. `Callback Queue`는 `Web API`에 해당하는 함수의 콜백을 추가된 순서대로 저장합니다.

**Event Loop**:  `Call Stack` 함수에서 함수 호출에 많은 시간이 걸리는 경우 어떻게 처리해야 할까요? 이경우 `Event Loop`이 작업을 처리합니다.

- `for loop`: 1 ~ 10billion
- 새로운 네트워크 요청 생성
- 이미지 처리 등의 작업을 처리합니다.

```javascript
console.log("start");

// 1 sec delay
function delay() { 
  for(var i = 0; i < 1000; i++);
  console.log("1 sec delay")
}

delay();

console.log("end");
```

`동기 코드 시각화(Synchronous Code Visualization)`
<a href="https://res.cloudinary.com/practicaldev/image/fetch/s--IkKwnYms--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588414062/V8%2520Engine/odkqyfqb5aashbygheme.gif" class="article-body-image-wrapper"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--IkKwnYms--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588414062/V8%2520Engine/odkqyfqb5aashbygheme.gif" alt="blocking" loading="lazy"></a>

`비동기 방식(Asynchronous Code)`을 사용하면 이 문제를 효과적으로 해결할 수 있습니다.

<a href="https://res.cloudinary.com/practicaldev/image/fetch/s--bcpbe6a0--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588414062/V8%2520Engine/dyloryy5xtyv24pdvkjh.gif" class="article-body-image-wrapper"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--bcpbe6a0--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_880/https://res.cloudinary.com/dqhskqqa6/image/upload/v1588414062/V8%2520Engine/dyloryy5xtyv24pdvkjh.gif" alt="blocking" loading="lazy"></a>

`Event Loop`: `Call Stack`과 `Callback Queue`를 살펴보고, `Call Stack`이 비어 있으면 `Callback Queue`의 첫 번째 콜백 함수를 `Call Stack`으로 전달합니다.

```javascript
console.log("start");

setTimeout(function() {
  console.log("1 sec delay");
} , 1000);

console.log("end");
```

<a href="http://latentflip.com/loupe/?code=JC5vbignYnV0dG9uJywgJ2NsaWNrJywgZnVuY3Rpb24gb25DbGljaygpIHsKICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gdGltZXIoKSB7CiAgICAgICAgY29uc29sZS5sb2coJ1lvdSBjbGlja2VkIHRoZSBidXR0b24hJyk7ICAgIAogICAgfSwgMjAwMCk7Cn0pOwoKY29uc29sZS5sb2coIkhpISIpOwoKc2V0VGltZW91dChmdW5jdGlvbiB0aW1lb3V0KCkgewogICAgY29uc29sZS5sb2coIkNsaWNrIHRoZSBidXR0b24hIik7Cn0sIDUwMDApOwoKY29uc29sZS5sb2coIldlbGNvbWUgdG8gbG91cGUuIik7!!!PGJ1dHRvbj5DbGljayBtZSE8L2J1dHRvbj4%3D">Event Loop Visualization</a>


# Promise - Async/Await in Node.js

`JavaScript`는 단일 쓰레드(Single Thread) 방식으로 실행되기 때문에, `blocking` 방식으로 동작합니다.

```javascript
function a() {
    console.log("result of a()");
}

function b() {
    console.log("result of b()");
}

function c() {
    console.log("result of c()");
}

// Call in sequence
a();
console.log("a() is done!");

b();
console.log("b() is done!");

c();
console.log("c() is done!");
```

위 결과에서 알 수 있듯이, 각 함수 호출과 `console.log()`는 동기적으로 실행됩니다`(Synchronous Manner)`. 이는 `a` 함수가 리턴하기 전에, 다음 줄의 코드가 실행될 수 없음을 의미합니다. 기본값으로, 정의한 함수이 리턴값이 없다면 내부적으로 `undefined`를 리턴합니다.

웹 API를 사용하여 일부 JavaScript 작업을 단일 쓰레드로 동작함에도, 마치 다른 쓰레드를 이용하는 것 처럼 구현할 수 있습니다. 예를 들면, `AJAX` 요청 처리는 반드시 다른 스레드(thread)에서 수행되어야 합니다. 그렇지 않으면 네트워크 응답이 수신될 때까지, 기본 스레드(thread)가 차단됩니다. 사용자의 화면이 몇 초 또는 몇 분 동안 정지된다면 사용자에게 끔찍한 경험이 될 수 있습니다.

웹 API는 자바스크립트 기능을 확장하며 비동기 작업을 수행하는 API입니다. 예를 들어, `setTimeout`은 지정된 지연 후에 일부 작업을 수행하는 웹 API입니다. (Event Loop 참고)

웹 API는 자바스크립트 표준의 일부가 아닙니다. 자바스크립트 엔진에 포함되지 않고, 대신 브라우저나 `node.js` 같은 서버 사이드 자바스크립트 프레임워크에 의해 제공됩니다.

기본적으로 `setTimeout(callback, delay)` 함수는 콜백을 받아 임시로 저장합니다. `delay` 만큼 지연을 기다렸다가, `스택(stack)`이 비어 있으면 `스택(stack)`에 콜백 함수를 푸시합니다. 그런 다음 콜백 기능이 실행됩니다. 이것이 기본적으로 모든 웹 API가 작동하는 방식입니다. 대부분의 웹 API는 콜백을 기반으로 동작합니다. 비동기 작업이 완료된 시점을 알려주기 위해 콜백 기능이 필요합니다.

```javascript
function a() {
    setTimeout(function() {
        console.log("result of a()");
    }, 1000); // 1초 지연
}

function b() {
    setTimeout(function() {
        console.log("result of b()");
    }, 500); // 0.5초 지연
}

function c() {
    setTimeout(function() {
        console.log("result of c()");
    }, 1200); // 1.2초 지연
}

a();
console.log("a() is done");

b();
console.log("b() is done");

c();
console.log("c() is done");

// a() is done!
// b() is done!
// c() is done!
// result of b()
// result of a()
// result of c()
```

이 결과는 직관적이지 않음을 알 수 있습니다.

`이벤트 루프(event loop)`는 기본 `javascript` 스레드에서 실행되며 다양한 이벤트를 수신하는 `단일 스레드 루프(single-thread-loop)`를 끝없이 실행합니다. 이것의 역할은 콜백 함수를 받아들여 `메인 스레드(main thread)`에서 실행하는 방식으로 동잡합니다. `이벤트 루프(event loop)`는 `메인 스레드(main thread)`에서 실행되므로, `메인 스레드(main thread)`가 사용 중이면 이벤트 루프는 기본적으로 해당 시간 동안 사용되지 않습니다. 

위 방식의 원리는 이해할 수 있지만 직관적이지 않음을 알 수 있습니다. 그렇다면 작성한 순서대로 직관적이게 결과를 얻으려면 어떻게 해야 할까요?

1. 함수의 인자로 `callback` 함수를 전달하는 방법

```javascript
function a(callback) {
    setTimeout(function() {
        console.log("result of a()");
        callback();
    }, 1000); // 1초 지연
}

function b(callback) {
    setTimeout(function() {
        console.log("result of b()");
        callback();
    }, 500); // 0.5초 지연
}

function c(callback) {
    setTimeout(function() {
        console.log("result of c()");
        callback();
    }, 1200); // 1.2초 지연
}

a(() => console.log("a() is done"));
b(() => console.log("b() is done"));
c(() => console.log("c() is done"));

// result of b()
// b() is done
// result of a()
// a() is done
// result of c()
// c() is done
```

위 코드는 `result of 함수, 함수 is done` 메세지가 순서대로 출력되도록 구현했지만, `a => b => c` 순서로 구현에는 실패했습니다.
이 방식대로 구현하기 위해서는 조건문을 사용해야 합니다.

```javascript
function a (callback) {
    setTimeout(() => {
        console.log("result of a()");
        callback();
    }, 1000);
}

function b (callback) {
    setTimeout(() => {
        console.log("result of b()");
        callback();
    }, 500);
}

function c (callback) {
    setTimeout(() => {
        console.log("result of c()");
        callback();
    }, 1200);
}

// call in sequence
a(() => {
    console.log("a() is done!");
    b(() => {
        console.log("b() is done!");
        c(() => {
            console.log("c() is done!");
        });
    });
})
```

이 방식의 최대 단점은 `콜백 => 콜백 => 콜백`의 방식으로 중첩을 이룬다는 점입니다. 이렇게 중첩되는 경우 가독성이 너무 떨어지기 때문에 코드 유지보수 및 협업에 큰 어려움이 생길 수 있습니다. 이를 해결하기 위해 `promise`를 사용할 수 있습니다. 

## Promises
`promise`는 위 방식처럼 비동기적으로 동작하는 코드를 동기적으로 처리할 수 있도록 해주는 기능을 제공합니다.
가장 큰 장점은 비동기 로직을 처리함에도, 동기적인 코드처럼 보이는 코드를 작성할 수 있습니다. 이 말은 즉 유지보수에도 용이 하다는 것으로 이해할 수 있습니다.

```javascript
// #1 - Sync
console.log('Before');

// #2 - Async
setTimeout(() => {         
    console.log('This is Async Function')
}, 2000)

// #3 - Sync
console.log('After');

// Result
// Before ==> After ==> This is Async Function
```
- 비동기로 동작하는 setTimeout 등과 함수의 리턴 값으로 다수의 비동기 함수를 리턴 값으로 정의하는 경우 코드 가독성이 좋지 않다는 의미에서, Callback Hell이라 칭합니다.

```javascript
function getUser(id, callback) {
    setTimeout(() => {
        console.log('Reading a user from a database...');
        callback({ id: id, gitHubUsername: 'su' });
    }, 2000);
}

function getRepositories(username, callback) {
    setTimeout(() => {
        console.log('Calling GitHub API...');
        callback(['repo1', 'repo2', 'repo3']);
    }, 2000);
}

function getCommits(repo, callback) {
    setTimeout(() => {
        console.log('Calling GitHub API...');
        callback(['commit']);
    }, 2000);
}

console.log('Before');

getUser(1, (user) => {
    getRepositories(user.gitHubUsername, (repos) => {
        getCommits(repos[0], (commits) => {
            console.log(commits);
        });
    });
});

console.log('After');
```

1. `Callback Hell`을 해결하는 첫 번째 방법: `Promise`
```javascript
console.log('Before');

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Reading a user from a database...');
            resolve({ id: id, gitHubUsername: 'su' });
        }, 2000);
    }); 
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Calling GitHub API...");
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    });
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("Calling GitHub API...");
            resolve(['commit']);
        }, 2000);
    });
}

getUser(1)
    .then(user => getRespositories(user.gitHubUsername))
    .then(repos => getCommits(repos[0]))
    .then(commits => console.log(commits))
    .catch(error => console.log(new Error(err)));
```

Promise All
- Promise All -->In Parallel Structure
- Promise All의 경우 먼저 시작하는 것은 있어도 먼저 시작한 것이 완료되든 안 되든 상관없이 바로 다음 것으로 넘어가 실행하고 먼저 결과값이 resolve 된 것을 차례로 배열에 담습니다.

```javascript
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("Async Operation 1...");
        resolve(1);
    }, 2000);
});

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log("Async Operation 2...");
        resolve(2);
    });
});


Promise.all([p1, p2])
    .then(result => console.log(result));
```

- `Promise All` 사용 시 오류가 발생하는 경우
- 여기서 주목할 점은 `promise.all`을 사용했을 때 여러 개의 `promise` 중 단 하나라도 에러가 있다면, `promise.all`은 모든 `promise`에 에러가 있는 것으로 간주한다는 점입니다.

```javascript
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("Async Operation 1...");
    reject(new Error("Because Something Failed!"));
  }, 2000);
});

const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    console.log("Async Operation 2...");
    resolve(2);
  }, 2000);
});

Promise.all([p1, p2])
  .then((result) => console.log(result))
  .catch((err) => console.log("Error", err.message));
```
여러 개의 비동기 동작이 거의 동시에 동작을 시작하고 단 하나의 동작이라도 완료가 되는 순간 어떤 행위를 하고 싶은 경우에 어떻게 해야 할까요?
- 이 경우 `promise.race`를 이용할 수 있습니다. 코드로 보자면, 기억하기 쉽게 비동기로 동작하는 함수 중 누가 먼저 `event loop`를 타고 `call stack`으로 올라오는가에 대해 경주하는 것입니다.

```javascript
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('Async Operation 1...');
        resolve(1);
    }, 2000);
})

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        console.log('Asnyc Operation 2...');
        resolve(2);
    }, 1000);
})

Promise.race([p1, p2])
    .then(result => console.log(result))
    .catch(err => console.log('Error', err.message));

/*
promise p1과 p2가 거의 동시에 비동기 동작을 시작했다.
하지만, race를 사용했기 때문에, p1이 동작이 끝나자마자 p1의 resolve 결과만 배열이 아닌 보통 값으로 리턴을 해준다.

즉, race는 여러 개의 promise를 거의 동시에 동작시킬 수 있지만 하나라도 동작이 끝난 promise가 발생하면 모든 promise가 끝이 났다고 간주하고, 가장 먼저 끝이 난 한 동작의 resolve 값을 return해준다 (단, 전제는 성공적으로 오류 없이 동작이 끝이 났을 때).

Result
'Async Operation 1...'
'Async Operation 2...'
2
*/
```

`Promise`를 활용한 비동기 코드 처리 방식을 요약하면 다음과 같습니다.
```javascript
getUser(1, (user) => {
    getRepositories(user.gitHubUsername, (repos) => {
        getCommits(repos[0], (commits) => {
            console.log(commits);
        })
    })
});


// Promise-based Approach
getUser(1)
    .then(user => getRepositories(user.gitHubUsername))
    .then(repos => getCommits(repos[0]))
    .then(commits => console.log('Commits', commits))
    .catch(err => console.log('Error', err.message));

function getUser(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Reading a user from a database...');
            resolve({ id: id, gitHubUsername: 'su' });
        }, 2000);
    });
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Calling GitHub API...');
            resolve(['repo1', 'repo2', 'repo3'])
        }, 2000);
    });
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Calling GitHub API...');
            resolve(['commit']);
        }, 2000);
    });
}
```
- `Promise-based approach` 방식을 조금 더 동기적 방식으로 표현할 수 있는 `Syntatical Sugar`를 `Async and Await Approach`라고 부릅니다.
- `Await Operator`는 `Promise`를 `return` 해주는 함수에서만 사용이 가능합니다.
- 예를 들면, `const a = 비동기 함수`,라고 했을 때 원래 a라는 변수에는 비동기 함수가 담길 수 없습니다.
- 하지만 그 앞에 `await operator`를 붙여주면 마치 비동기 함수인 것처럼 동작합니다.
- 예를 들면, `const user = await 비동기 함수(1)`는 일반 함수와 달리 모든 비동기 함수의 동작이 다 끝날 때까지 기다리고 마치 일반 함수를 호출해 리턴 한 값을 할당하는 것처럼 동작합니다.

```javascript
console.log('Before')
const user = await getUser(1);
const repos = await getRepositories(user);
const commits = await getCommits(repos[0]);
console.log(commits);
console.log('After')

function getUser(id) {
    return new Promise((resolve, reject) => {
        // Kick off some async work 
        setTimeout(() => {
            console.log('Reading a user from a database...');
            resolve({ id: id, gitHubUsername: 'mosh' });
        }, 2000);
    });
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Calling GitHub API...');
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    });
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Calling GitHub API...');
            resolve(['commit']);
        }, 2000);
    });
}
```
- `await operator`를 사용했을 때의 장점은 우리가 조금 더 `callback`과 `promise`에 비해 읽고 이해하기가 용이하고, 비동기적 동작을 마치 동기적으로 동작하는 것처럼 보여준다는 점이고, 하나 더 추가하자면, `promise`에서 사용했던 `then and catch chain`을 사용할 필요가 없다는 점입니다.

그럼 `async`는 어디에 사용되는 것인가요?
- 우리가 함수 안에서 `await operator`를 사용할 때마다 우리는 이 함수명은 `async modifier`로 꾸며 줘야합니다. 위 코드는 현재 `async keyword`가 없이 때문에 동작하지 않습니다.

```javascript
function getUser(id) {
    return new Promise((resolve, reject) => {
        // Kick off some async work 
        setTimeout(() => {
            console.log('Reading a user from a database...');
            resolve({ id: id, gitHubUsername: 'mosh' });
        }, 2000);
    });
}

function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Calling GitHub API...');
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    });
}

function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Calling GitHub API...');
            resolve(['commit']);
        }, 2000);
    });
}

console.log('Before')

async function displayCommits() {
    const user = await getUser(1);
    const repos = await getRepositories(user);
    const commits = await getCommits(repos[0]);
    console.log(commits);
}

displayCommits();
console.log('After')
```

함수 안에 `await`을 사용할 때 `async`를 사용해야 하는 이유
1. 항상 `promise`를 `return` 함을 명시하기 위해.
2. 만일 한 함수가 `Non-Promise`를 리턴해줘도 `async`가 앞에 붙어있으면 `JS Engine`은 자동으로 `return` 해주는 값을 `resolve promise 감싸서 리턴하는 역할을 합니다.
3. `VSCode`에서 `displayCommits()`에 마우스를 대면 `return type`이 `void`라 나온다. 이것은 `promise`를 이미 `return` 하고 난 뒤 어떠한 것도 `return` 할 것이 없기 때문이다. 만일 `return` 값이 `promise`가 아닌 경우 `void`가 아닌 `undefined`이 출력됩니다.

요약:`promise`가 있어야먄 `return` 할 것이 없을 때 `void`를 리턴합니다. 하지만, 내부적으로는 `promise-based approach`와 동일하게 동작합니다.
- 마지막으로 `async and await`의 경우, `promise`와 같이 `catch/then`을 사용하지 않기 때문에, 오류 검사 시 `try/catch` 문을 대안으로 사용합니다.

```javascript
async function displayCommits() {
    try {
        const user = await getUser(1);
        const repos = await getRepositories(user);
        const commits = await getCommits(repos[0]);
        console.log(commits);

    }

    catch (err) {
        console.log('Error', err.message);
    }
}

displayCommits();

function getUser(id) {
    return new Promise((resolve, reject) => {
        // Kick off some async work 
        setTimeout(() => {
            console.log('Reading a user from a database...');
            resolve({ id: id, gitHubUsername: 'mosh' });
        }, 2000);
    });
}
function getRepositories(username) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Calling GitHub API...');
            //      resolve(['repo1', 'repo2', 'repo3']);
            reject(new Error('Could not get the repos'))
        }, 2000);
    });
}
function getCommits(repo) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log('Calling GitHub API...');
            resolve(['commit']);
        }, 2000);
    });
}

// 결과
// Before
// After
//'Reading a user from a database...'
//'Calling GitHub API...'
// Error Could not get the repos.
```