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

// 채팅 목록
router.get("/", (req, res) => {
  console.log("Here is chat page");
  if (!req.session.user) {
    return res.status(401).send("로그인이 필요합니다.");
  }

  const currentUserNickname = req.session.user.nickname;
  pool.query(
    "SELECT roomId, nickname, state FROM users WHERE nickname != ?",
    [currentUserNickname],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("서버 오류");
      } else {
        console.log(results); // 응답 데이터 확인을 위한 로그 추가
        res.json(results);
      }
    }
  );
});

// 채팅방 메시지 조회 (GET)
router.get("/chatrooms/to/:receiver_room", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("로그인이 필요합니다.");
  }

  const sender_room = req.session.user.roomid;
  const { receiver_room } = req.params;

  console.log(
    `Fetching messages for sender_room: ${sender_room}, receiver_room: ${receiver_room}`
  ); // 콘솔로그

  pool.query(
    "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)",
    [sender_room, receiver_room, receiver_room, sender_room],
    (error, results) => {
      if (error) {
        console.error("Error fetching messages:", error);
        res.status(500).send("서버 오류");
      } else {
        console.log("Fetched messages:", results);
        res.json(results);
      }
    }
  );
});

// 새로운 메시지 전송 (POST)
router.post("/chatrooms/to/:receiver_room", (req, res) => {
  if (!req.session.user) {
    return res.status(401).send("로그인이 필요합니다.");
  }

  const sender_room = req.session.user.roomid;
  const { receiver_room } = req.params;
  const { content } = req.body;

  console.log("Received message to store:", {
    sender_room,
    receiver_room,
    content,
  });

  pool.query(
    "SELECT * FROM users WHERE roomId = ?",
    [receiver_room],
    (err, results) => {
      if (err) {
        console.error("Error checking user IDs:", err);
        return res.status(500).send("서버 오류");
      }

      if (results.length === 0) {
        console.error("Invalid receiver_room:", { receiver_room });
        return res.status(400).send("유효하지 않은 receiver_room");
      }

      pool.query(
        "INSERT INTO messages (sender_id, receiver_id, content) VALUES (?, ?, ?)",
        [sender_room, receiver_room, content],
        (error, results) => {
          if (error) {
            console.error("Message save error:", error);
            return res.status(500).send("서버 오류");
          } else {
            console.log("Message saved successfully:", results);
            return res.status(201).send("메시지 전송 성공");
          }
        }
      );
    }
  );
});

router.use("/chat", router);

module.exports = router;
