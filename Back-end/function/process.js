// /process를 통해 server에 있는 정보를 줄 때 이 파일을 통해 주게됨
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const app = express();
const router = express.Router();

// /index 접속했을 때 다음과 같은 일을 하세요
app.get("/process", (req, res) => {
  console.log("Here is process page");
});

// /login/~~ 에 접속했을 때 다음과 같은 일을 하세요
router.get("/~~", (req, res) => {
  console.log("Here is process/~~~ page");
});

router.get("/check-login", (req, res) => {
  console.log("/check-login 호출됨"); // 디버깅용 로그asdas
  if (req.session.user) {
    console.log("로그인 상태 확인됨"); // 디버깅용 로그
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    console.log("로그인 상태 아님"); // 디버깅용 로그
    res.json({ loggedIn: false });
  }
});

//app과 router 연동
app.use("/process", router);
module.exports = router;
