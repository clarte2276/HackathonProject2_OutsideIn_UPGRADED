//마이페이지 구현
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const db_config = require("./config/db_config.json");
const app = express();
const router = express.Router();

//mypage를 접속했을 때 다음과 같은 일을 하세요
app.get("/mypage");

//mypage/~~ 가 됐을 때 무슨일을 하세요
router.get("/");

//app과 router 연동
app.use("/mypage", router);
module.exports = router;
