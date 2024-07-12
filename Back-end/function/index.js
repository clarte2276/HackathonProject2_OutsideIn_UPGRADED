//라우터 모음집
const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
const db_config = require("../config/db_config.json");
const app = express();
const router = express.Router();

// /index 접속했을 때 다음과 같은 일을 하세요
app.get("/index", (req, res) => {
  console.log("Here is index page");
});

// /login/~~ 에 접속했을 때 다음과 같은 일을 하세요
router.get("/~~", (req, res) => {
  console.log("Here is login/~~~ page");
});
//app과 router 연동
app.use("/index", router);
module.exports = router;
