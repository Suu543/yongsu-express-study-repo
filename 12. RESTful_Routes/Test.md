# React

## Significant Concepts

### What does React focus on?

Vanilla JavaScript를 사용하여 DOM에 접근하게 되면 document를 구성하는 모든 객체들이 함께 작동한다. 그럼으로 그때마다 성능적으로, 메모리적으로 낭비가 심하다. 반면 리엑트는 필요한 것들만 챙길수있는 주머니 같은 형태로 이루어져 이전 방식보다 성능, 메모리 모든 부분에서 최적의 성능을 이끌어 낼수있다.

### Why does React is powerful?

DOM은 CRUD에 관한 어떤 동작이 발생하든, DOM을 다시 그리는 방식으로 동작한다. 반면에 리엑트는 최초 렌더링에 실제 DOM을 복사한 virtualDOM을 생성하는 데 이는 HTML 요소를 마치 JavaScript Object처럼 간주하기 때문에 브라우저가 일일이 HTML, CSS, JavaScript 코드를 처음부터 다시 해석하는 과정 없이, 딱 필요한 부분에 변경된 사항을 반영하기 때문에 메모리, 성능, 그리고 코드 관리 등 모든 부분에서 큰 이점을 얻을 수 있다. 다만 단점이 있다면, 리엑트를 이해하려면 Vanilla JavaScript 방식으로 DOM을 렌더링해본 경험이 있어야 한다는 점이다.

### Then what is the virtual Dom?

처음 Component를 Render해줄때, 어느 위치에 Component를 넣어줄것인지 지정해주는데 이때 Virtual Dom 생성된다. 쉽게 말해 부모로 시작해 계속해서 내려가는 가상 차원에 트리구조로 된 데이터이다. 이는 위에서 말했듯이, 브라우저에 Component를 Rendering 해줄때 변화된 부분과 비교하는데 사용된다.

React Virtual Process.
![](https://user-images.githubusercontent.com/61978339/101712745-8e9e8600-3ad9-11eb-8ea5-5b6f47c67c2d.png)

### Why Class is used to create Component?

Component를 Class로 생성함으로써 화면 생성, 생신, 삭제의 시점으로 명확히 구분해 각 단계에 맞는 기능을 기능할수있다.
또한, 하나의 UI를 하나의 파일과 같은 형태로 간주하기 때문에 보다 논리적이고 엄격하게 관리 할수있다.

### Babel

React에서 Babel은 없어서는 안 될 존재이다. 이 아이는 JSX코드(JS와 HTML이 함께 사용되는 코드)를 감지해서 JS Engine이 이해할수있는 코드로 변환해준다. 쉽게 말하면, 밑에 코드를 보면 우리가 실제로 쓰는 코드는 첫번째이다. 하지만 이는 매우 간편화된 것이다. Babel이 없으면 React는 저 코드를 이해하기 어렵다. Babel이 첫번째 코드를 JS Engine이 이해할수 있는 두번째 코드로 변환해주기 때문이다.

```javascript
ReactDOM.render(<h1>Sanity Check</h1>, document.getElementById("root"));

-->

ReactDOM.render( /*#__PURE__*/React.createElement("h1", null, "Sanity Check"), document.getElementById("root"));
```

## Props

Component에서 데이터를 저장하는 방법은 Props와 State 두가지가 있다. 우선 Props에 대해서 먼저 얘기해보려고 한다. Props는 부모 Component가 자식에게 넘겨줌으로써 데이터를 사용할수있다. 하지만 Props의 데이터는 절대 변경하지 못한다. 오직 읽기만 가능하다. 코드를 보면 이해가 쉬울것이다.

```javascript
    //React를 사용하기 위해서 Command창에서 설치를 해야한다.
    npx create-react-app lifecycle-practice
```

```javascript
class Card extends React.Component {
  constructor() {
    super();
    console.log("Constructor Ran");
  }
  render() {
    //받아온 데이터를 Class에서는 this.props.변수이름.해당이름 순으로 사용한다. Function에서는 this빼고 동일하게 표기해주면 된다.
    return (
      <div className="col s2">
        <div className="card hoverable small">
          <div className="card-image">
            <img src={this.props.data.image} />
          </div>
          <div className="card-content">
            <p>{this.props.data.course}</p>
            <p>{this.props.data.instructor}</p>
          </div>
          <div className="card-action">
            <a href="#">$9.99</a>
          </div>
        </div>
      </div>
    );
  }
}
```

```javascript
const cards = data.map((course, i) => {
  //Component 호출 후 옆에 보이는 data가 props를 심어준 케이스다. key는 virtual Dom과 비교할때 몇번째 트리에 있는지 알아야 하기때문에 필수적으로 명시해줘야 한다.
  return <Card key={i} data={course} />;
});

ReactDOM.render(
  <div className="row">{cards}</div>,
  document.getElementById("root"),
);
```

## State

State를 이용해서도 Data를 저장 할수있다. 사전상으로 State의 뜻은 value of variables이다. Components 안에서 초기 값을 설정해주고 상황에 맞춰서 data를 변경한다. 이 특성은 화장대와 같다. 화장대는 주로 화장을 할 때 사용한다. 립스틱, 마스카라, 로션 등 많은 화장품들이 있다. 필요에 따라 골라서 사용할수있다. State도 마찬가지이다. State는 Constructor에서 무조건 초기화를 해줘야 필요에 따라 사용할수있다. 초기화 할때는 1번 코드와 같이 정의를 해줘야하고 갱신할때에는 2번 코드와 같이 해줘야하고 State 값을 사용할때에는 3번 코드와 같이 해줘야 오류 없이 작동한다.

```javascript
import React, { Component } from "react";

class StateInAction extends Component {
  constructor() {
    super();
    //1
    this.state = {
      text: "State In Action",
    };

    //2
    //aero function을 사용해야 this binding이 되서 setState를 사용할수있다.
    setTimeout(() => {
      this.setState({
        text: "State In Action - 2",
      });
    }, 2000);

    // setTimeout(function () {
    //   this.setState({
    //     text: "State Changed",
    //   });
    // }, 2000);
  }
  render() {
    return (
      <div>
        //3
        <h1>{this.state.text}</h1>
      </div>
    );
  }
}
export default StateInAction;
```

## Axios + HTTP

WebAPI 중에서 fetch를 서버에서도 사용할수있도록 도와주는 도구가 Axios이다. JSON 형태로 외부의 API에서 데이터를 받아올수 있게 해주는 함수를 말한다. Component에서 Axios를 어떤 위치에 배치하냐에 따라서 오류가 발생할수도 있다.

### Constructor에 배치할 경우

```javascript
import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class Axioserror extends Component {
  constructor() {
    super();
    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=e312dbeb8840e51f92334498a261ca1d";
    console.log("constructor");
    axios.get(url).then((res) => {
      //constructor이미 동작하고 render하는 시점에 데이터를 받아온다는 보장이 없으니까
      console.log("axios");
      this.state = {
        temp: res.data.main.temp,
      };
    });
  }

  render() {
    console.log("render");
    return (
      <div className="AxiosError">
        <h1>{this.state.temp}</h1>
      </div>
    );
  }
}

export default Axioserror;
```

### Render에 배치할 경우

```javascript
import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    console.log("constructor");
    this.state = {
      temp: "",
    };
  }

  render() {
    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=e312dbeb8840e51f92334498a261ca1d";
    console.log("render");

    //계속 반복되서 그래! 무한 루프임 => stetState가 호출 될때마다 render가 호출 되기때문에 다시 render들어가면 다시 setState를 진행할거고 그럼 또 다시 render로 들어가는 무한루프에 빠지게 된다.
    axios.get(url).then((res) => {
      this.setState({
        temp: res.data.main.temp,
      });
      console.log(this.state.temp);
    });

    return (
      <div className="App">
        <h1>{this.state.temp}</h1>
      </div>
    );
  }
}

export default App;
```

### 올바르게 배치한 경우

이는 위의 두가지 방식의 직접적인 해결방식이다. 첫번째, constructor에 axios를 넣은 경우, constructor 이미 동작한 상태이고 render가 실행되기 전에 데이터를 받아온다는 보장이 없기때문에 잘못된 코드이다. 두번째, render에 axios를 넣은 경우, 처음 render를 호출하고 난 후 setState가 실행되면 그때마다 render를 다시 호출하기 때문에 다시 setState가 호출되고 이 과정에 반복하게 된다. 따라서 위 두가지 경우를 해결하기 위해서는 Lifecycle의 개념 이해가 필요하다. componentDidMount에 대해 아는 것이 중요하다. 이는 서버가 제대로 작동하기 전에 기초적인 설정을 하는 구간이라 할 수 있다. componentDidMount에서는 이미 virtaul Dom이 생성되고 난 후 작동하기 때문에 비동기의 문제는 걱정할 필요가 없고 render 밖에서 독립적으로 작동하기 때문에 위의 문제들을 해결할 수 있다.

```javascript
import React, { Component } from "react";
import axios from "axios";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    console.log("constructor");
    this.state = {
      temp: "",
    };
  }

  componentDidMount() {
    console.log("componentDidMount");

    const url =
      "https://api.openweathermap.org/data/2.5/weather?q=London&units=imperial&appid=e312dbeb8840e51f92334498a261ca1d";

    axios.get(url).then((res) => {
      this.setState({
        temp: res.data.main.temp,
      });
      console.log(this.state.temp);
    });
  }

  render() {
    console.log("render");

    return (
      <div className="App">
        <h1>{this.state.temp}</h1>
      </div>
    );
  }
}

export default App;
```

## LifeCycle

LifeCycle은 특정 Component 안에서 코드가 작동하는 단계적 순서를 뜻한다. 크게 Mounting(화면 생성), Updating(화면 갱신), UnMounting(화면 삭제)가 있다. 처음 화면이 Rendering되고 갱신되고 화면에서 완전이 삭제되는 과정으로 나눈것이다. 조금 더 자세하게 알아보자.

![](life_cycle.jpg)

### ComponentDidMount

그림을 보면 알수있듯이 LifeCycle에는 ComponentDidMount만 있는것이 아니다. 위에서 말했듯이 ComponentDidMount는 첫 Render에 대한 초기 설정 혹은 기능적 추가라 볼수있다. 이외에도 ComponentDidUpdate, ComponentwillUnMount가 있다.