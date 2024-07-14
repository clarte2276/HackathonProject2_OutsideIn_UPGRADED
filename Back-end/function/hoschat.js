// 의사와 사용자 온라인일대일채팅 기능
const express = require("express");
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
const router = express.Router();

const pool = mysql.createPool({
  connectionLimit: 10,
  host: db_config.host,
  user: db_config.user,
  password: db_config.password,
  database: db_config.database,
  port: db_config.port,
  debug: false,
});

// 채팅방 메시지 조회 (GET)
router.get("/:hospital/:my_roomid/to/:doctor_id/messages", (req, res) => {
    const { hospital, my_roomid, doctor_id } = req.params;
    const session_user_id = req.session.user.id;
  
    pool.query(
      "SELECT * FROM hoschat WHERE (sender_id = ? AND receiver_id = ?)",
      [session_user_id, doctor_id],
      (error, results) => {
        if (error) {
          console.error("Error fetching messages:", error);
          return res.status(500).send("서버 오류");
        }
        res.json(results);
      }
    );
  });
  
  // 새로운 메시지 전송 (POST)
  router.post("/:hospital/:my_roomid/to/:doctor_id/messages", (req, res) => {
    const { hospital, my_roomid, doctor_id } = req.params;
    const { receiver_id, content } = req.body;
    const session_user_id = req.session.user.id;
  
    pool.query(
      "INSERT INTO hoschat (sender_id, receiver_id, content) VALUES (?, ?, ?)",
      [session_user_id, doctor_id, content],
      (error, results) => {
        if (error) {
          console.error("Message save error:", error);
          return res.status(500).send("서버 오류");
        }
        // 두 번째 쿼리를 수행하고, 모든 쿼리가 성공하면 응답
        pool.query(
          "INSERT INTO hoschat (sender_id, receiver_id, content) VALUES (?, ?, ?)",
          [session_user_id, doctor_id, content],
          (error, results) => {
            if (error) {
              console.error("Message save error:", error);
              return res.status(500).send("서버 오류");
            }
            res.status(201).send("메시지 전송 성공");
          }
        );
      }
    );
  });
  
  router.use('/hospital', router);
  module.exports = router;