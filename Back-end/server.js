//server.js
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const db_config = require("./config/db_config.json");

const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// MySQL 세션 스토어 옵션
const sessionStoreOptions = {
  host: db_config.host,
  port: db_config.port,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
};

const sessionStore = new MySQLStore(sessionStoreOptions);

const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// URL을 인코딩하는 코드
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    key: "session_cookie_name",
    secret: "your_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 24시간
  })
);

const indexRoutes = require("./function/index");
const mypageRoutes = require("./function/mypage");
const loginRoutes = require("./function/login");

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Front-end/build", "index.html"));
});

app.listen(3000, () => {
  console.log("서버가 3000 포트에서 실행 중입니다.");
});
