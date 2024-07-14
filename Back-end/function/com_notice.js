const express = require("express");
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
const moment = require("moment");
const router = express.Router();

const pool = mysql.createPool(db_config);

// 관리자 계정 확인 미들웨어
const checkAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.user_mode === 0) {
    next();
  } else {
    res.status(403).send("Not Admin");
  }
};

// 게시판 데이터
const getBoardData = async (boardType, res) => {
  try {
    const [results] = await pool
      .promise()
      .query(
        `SELECT no, title, nickname, content, created_date FROM community WHERE board_type = ?`,
        [boardType]
      );
    res.json(results);
  } catch (error) {
    console.error(error);
    res.status(500).send("서버 오류");
  }
};

const insertBoardData = async (
  boardType,
  title,
  nickname,
  content,
  createdDate,
  res,
  redirectUrl
) => {
  try {
    await pool
      .promise()
      .query(
        `INSERT INTO community (board_type, title, nickname, content, created_date) VALUES (?, ?, ?, ?, ?)`,
        [boardType, title, nickname, content, createdDate]
      );
    res.redirect(redirectUrl);
  } catch (error) {
    console.log("SQL 실행 시 오류 발생", error);
    res.status(500).send("Query 실패");
  }
};

const getPostDetails = async (boardType, postId, req, res) => {
  try {
    const conn = await pool.promise().getConnection();
    try {
      const [postResult] = await conn.query(
        `SELECT * FROM community WHERE no = ? AND board_type = ?`,
        [postId, boardType]
      );
      const [commentResult] = await conn.query(
        `SELECT * FROM comments WHERE board_no = ? AND board_type = ?`,
        [postId, boardType]
      );
      res.json({
        post: postResult[0],
        comments: commentResult,
        session: req.session,
      });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error("서버 오류:", error);
    res.status(500).send("서버 오류");
  }
};

const deletePost = async (boardType, postId, req, res, redirectUrl) => {
  try {
    const [results] = await pool
      .promise()
      .query(`SELECT nickname FROM community WHERE no = ? AND board_type = ?`, [
        postId,
        boardType,
      ]);

    if (
      results.length > 0 &&
      results[0].nickname === req.session.user.nickname
    ) {
      await pool
        .promise()
        .query(`DELETE FROM community WHERE no = ? AND board_type = ?`, [
          postId,
          boardType,
        ]);
      console.log("게시물 삭제 완료");
      res.redirect(redirectUrl);
    } else {
      res.status(403).send("삭제 권한이 없습니다.");
    }
  } catch (error) {
    console.error("쿼리 실행 중 오류 발생: ", error);
    res.status(500).send("내부 서버 오류");
  }
};

const updatePost = async (
  boardType,
  postId,
  title,
  content,
  date,
  res,
  redirectUrl
) => {
  try {
    await pool
      .promise()
      .query(
        `UPDATE community SET title = ?, content = ?, created_date = ? WHERE no = ? AND board_type = ?`,
        [title, content, date, postId, boardType]
      );
    console.log("게시물 수정 완료");
    res.redirect(redirectUrl);
  } catch (error) {
    console.error("쿼리 실행 중 오류 발생: ", error);
    res.status(500).send("내부 서버 오류");
  }
};

// 공지게시판 접속
router.get("/", (req, res) => {
  console.log("Here is notice page");
  getBoardData("notice", res);
});

// 공지 게시판 글쓰기 창 조회-> 관리자만 접근
router.get("/CommunityWrite", checkAdmin, (req, res) => {
  const { title, content } = req.body;
  const nickname = req.session.user.nickname;
  const createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  insertBoardData(
    "notice",
    title,
    nickname,
    content,
    createdDate,
    res,
    "/notice"
  );
});

// 공지 게시판 글쓰기 등록-> 관리자만 접근
router.post("/process/new_Post", checkAdmin, (req, res) => {
  const { title, content } = req.body;
  const nickname = req.session.user.nickname;
  const createdDate = moment().format("YYYY-MM-DD HH:mm:ss");
  insertBoardData(
    "notice",
    title,
    nickname,
    content,
    createdDate,
    res,
    "/notice"
  );
});

// 공지게시판 읽기
router.get("/PostView/:no", (req, res) => {
  getPostDetails("notice", req.params.no, req, res);
});

router.post("/PostView/:no", (req, res) => {
  getPostDetails("notice", req.params.no, req, res);
});

// 공지 게시글 삭제
router.post("/Postview/:no/process/delete", checkAdmin, (req, res) =>
  deletePost("notice", req.params.no, req, res, "/notice")
);

// 공지 게시글 수정 load
router.get("/Postview/:no/process/update", checkAdmin, async (req, res, next) => {
  try {
    const [results] = await pool
      .promise()
      .query("SELECT * FROM community WHERE no = ? AND board_type = ?", [
        req.params.no,
        "notice",
      ]);
    if (results.length > 0) {
      const post = results[0];
      if (post.nickname === req.session.user.nickname) {
        next();
      } else {
        res.status(403).send("Not admin");
      }
    } else {
      res.status(404).send("No post");
    }
  } catch (error) {
    console.error("쿼리 실행 중 오류 발생: ", error);
    res.status(500).send("내부 서버 오류");
  }
});

// 공지 게시글 수정 등록
router.post("/PostView/:no/process/update/", checkAdmin, (req, res) => {
  const { title, content, created_date } = req.body;
  updatePost(
    "notice",
    req.params.no,
    title,
    content,
    created_date || new Date(),
    res,
    "/notice"
  );
});

// /notice 일 때 router와 연동
router.use("/notice", router);

module.exports = router;
