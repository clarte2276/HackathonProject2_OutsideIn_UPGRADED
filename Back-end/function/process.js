// /process를 통해 server에 있는 정보를 줄 때 이 파일을 통해 주게됨
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const router = express.Router();

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
router.use("/process", router);
module.exports = router;
