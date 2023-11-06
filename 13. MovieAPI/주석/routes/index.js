// Axios 라이브러리를 가져와 HTTP 요청을 처리합니다.
const axios = require("axios");

// Express 모듈을 가져옵니다.
const express = require("express");

// 새로운 라우터 객체를 생성하여 경로를 관리합니다.
const router = express.Router();

// The Movie Database API 키를 정의합니다.
const apiKey = "1fb720b97cc13e580c2c35e1138f90f8";

// The Movie Database API의 기본 URL을 정의합니다.
const apiBaseUrl = "https://api.themoviedb.org/3";

// 현재 상영 중인 영화 정보를 가져오는 URL을 구성합니다.
const nowPlayingUrl = `${apiBaseUrl}/movie/now_playing?api_key=${apiKey}`;

// 영화 포스터 이미지의 기본 URL을 정의합니다.
const imageBaseUrl = "http://image.tmdb.org/t/p/w300";

// 전역 미들웨어와 로컬 미들웨어가 여기서 사용될 수 있습니다. 예시로 주석 처리되어 있습니다.
// global middleware (): app.use()
// local middleware (): router.use()

// 'locals'는 Express에서 사전 정의된 키워드입니다. ejs 템플릿 엔진에서 사용하여,
// HTML 내에서 반복문, 조건문 등을 실행하고 특정 데이터를 'locals'를 통해 전달할 수 있습니다.
// res.render("index", {인자값})

// 라우터 미들웨어를 사용하여 모든 뷰에 imageBaseUrl을 사용할 수 있도록 설정합니다.
router.use((req, res, next) => {
  res.locals.imageBaseUrl = imageBaseUrl;
  next();
});

// 메인 페이지의 라우터를 정의합니다. 현재 상영 중인 영화 데이터를 가져옵니다.
router.get("/", async (req, res, next) => {
  console.log("");
  console.log(nowPlayingUrl);
  // Axios를 사용하여 현재 상영 중인 영화 데이터를 가져옵니다.
  const response = await axios.get(nowPlayingUrl);
  // 가져온 데이터를 변수에 저장합니다.
  const fetchedData = response.data;
  // 가져온 데이터를 index 템플릿에 전달하여 렌더링합니다.
  res.render("index", {
    parsedData: fetchedData.results,
  });
});

// '/movie/:id'는 와일드카드 경로입니다. ':id' 부분에는 영화 ID가 들어갑니다.
router.get("/movie/:id", async (req, res, next) => {
  // 영화 ID를 요청 매개변수에서 추출합니다.
  const movieId = req.params.id;
  // 특정 영화에 대한 상세 정보 URL을 구성합니다.
  const thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${apiKey}`;
  // Axios를 사용하여 해당 영화의 데이터를 가져옵니다.
  const fetchedData = await axios.get(thisMovieUrl);

  console.log("fetchedData: ", fetchedData);

  // 가져온 데이터를 single-movie 템플릿에 전달하여 렌더링합니다.
  res.render("single-movie", {
    parsedData: fetchedData.data,
  });
});

// 검색 기능을 위한 POST 라우터를 정의합니다.
router.post("/search", async (req, res, next) => {
  // 사용자의 검색어를 URL에 맞게 인코딩합니다.
  const userSearchTerm = encodeURI(req.body.movieSearch);
  // 카테고리 값을 요청 본문에서 가져옵니다.
  const cat = req.body.cat;
  // 검색 URL을 구성합니다.
  const movieUrl = `${apiBaseUrl}/search/${cat}?query=${userSearchTerm}&api_key=${apiKey}`;

  // 검색 결과를 가져옵니다.
  const response = await axios.get(movieUrl);
  let parsedData = response.data.results;

  console.log(parsedData);

  // 만약 카테고리가 'person'이면, 해당 인물이 알려진 주요 작품들만 필터링합니다.
  if (cat == "person") {
    parsedData = parsedData[0].known_for;
  }

  // 검색 결과를 index 템플릿에 전달하여 렌더링합니다.
  res.render("index", {
    parsedData,
  });
});

// 모듈로 라우터를 내보냅니다.
module.exports = router;
