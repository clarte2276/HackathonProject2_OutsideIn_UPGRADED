//마이페이지 구현
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const app = express();
const router = express.Router();

router.get("/", (res, req) => {
  console.log("here is mypage tab");
});
// /mypage/~~ 에 접속했을 때 다음과 같은 일을 하세요
router.get("/~~", (req, res) => {
  console.log("Here is mypage/~~~ page");
});
//app과 router 연동
app.use("/mypage", router);
module.exports = router;
