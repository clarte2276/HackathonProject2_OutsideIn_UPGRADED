//마이페이지 구현
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const router = express.Router();

router.get("/", (res, req) => {
  console.log("here is mypage tab");
});
// /mypage/~~ 에 접속했을 때 다음과 같은 일을 하세요
router.get("/mypage/process/update", (req, res) => {
  console.log("Here is /mypage/process/update page");
});
//app과 router 연동
router.use("/mypage", router);
module.exports = router;
