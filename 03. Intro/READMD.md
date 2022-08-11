# Node.js

## window vs global
`Browser`에서는 `window object`는 전역 객체로서 어디서든 접근할 수 있습니다. 

```javascript
// 아래 코드는 window를 prefix 하지 않아도 사용할 수 있습니다.
console.log();
setTimeout();
clearTimeout();

window.console.log() === console.log()
window.setTimeout() === setTimeout()

var message = '';
window.message
```

