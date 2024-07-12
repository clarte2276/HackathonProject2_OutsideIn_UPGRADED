// /process를 통해 server에 있는 정보를 줄 때 이 파일을 통해 주게됨
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const db_config = require("./config/db_config.json");
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
//app과 router 연동
app.use("/process", router);
module.exports = router;
