//게시판 기능
const express = require("express");
const mysql = require("mysql");
const db_config = require("../config/db_config.json");
const moment = require("moment");
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

// joy
// 게시글 목록 조회
router.post("/joy", (req, res) => {
  pool.query(
    "SELECT no, title, nickname, content, created_date FROM communityjoy",
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send("서버 오류");
      } else {
        res.json(results); // JSON 형식으로 응답
      }
    }
  );
});

// 새로운 게시글 추가
router.post("/CommunityWrite/joy", async (req, res) => {
  const paramTitle = req.body.title;
  const paramNickname = req.session.user.nickname; // 세션에서 닉네임 가져오기
  const paramContent = req.body.content;
  const createdDate = moment().format("YYYY-MM-DD HH"); // 현재 시간

  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log("MySQL Connection Error", err);
        if (conn) conn.release();
        res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
        res.write("<h2>DB 서버 연결 실패</h2>");
        res.end();
        return;
      }
      console.log("데이터베이스 연결 성공");

      const exec = conn.query(
        "INSERT INTO board (title, nickname, content, created_date) VALUES (?, ?, ?, ?)",
        [paramTitle, paramNickname, paramContent, createdDate, viewCount],
        (err, result) => {
          conn.release();
          console.log("실행된 SQL: " + exec.sql);

          if (err) {
            console.log("SQL 실행 시 오류 발생", err);
            res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
            res.write("<h2>Query 실패</h2>");
            res.end();
            return;
          }

          if (result) {
            console.dir(result);
            console.log("insert 성공");
            res.redirect("/joy"); // 목록 페이지로 리디렉트
          } else {
            console.log("insert 실패");
            res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
            res.write("<h2>게시글 추가 실패</h2>");
            res.end();
          }
        }
      );
    });
  } catch (error) {
    console.log("게시글 저장 오류", error);
    res.writeHead("200", { "Content-Type": "text/html; charset=utf8" });
    res.write("<h2>게시글 저장 실패</h2>");
    res.end();
  }
});

// 게시글 상세 페이지 및 댓글 조회
router.get("/joy/PostView/:no", (req, res) => {
  const postId = req.params.no;

  pool.getConnection((err, conn) => {
    if (err) {
      console.error("MySQL 연결 오류:", err);
      res.status(500).send("서버 오류");
      return;
    }

    // 게시글 조회
    const postQuery = "SELECT * FROM communityjoy WHERE no = ?";
    conn.query(postQuery, [postId], (err, postResult) => {
      if (err) {
        console.error("게시글 조회 오류:", err);
        conn.release();
        res.status(500).send("서버 오류");
        return;
      }
      // 댓글 조회
      const commentQuery = "SELECT * FROM comment WHERE board_no = ?";
      conn.query(commentQuery, [postId], (err, commentResult) => {
        conn.release();
        if (err) {
          console.error("댓글 조회 오류:", err);
          res.status(500).send("서버 오류");
          return;
        }
        res.json({
          post: postResult[0],
          comments: commentResult, // comments 배열을 전달
          session: req.session, // 세션 전달
        });
        // res.render('view_post', {
        //   post: postResult[0],
        //   comments: commentResult, // comments 배열을 전달
        //   session: req.session, // 세션 전달
        // });
      });
    });
  });
});

// 게시물 삭제
router.get("/joy/delete/:no", (req, res) => {
  const paramsNo = req.params.no;

  pool.query(
    "SELECT nickname FROM communityjoy WHERE no = ?",
    [paramsNo],
    (error, results) => {
      if (error) {
        console.error("쿼리 실행 중 오류 발생: ", error);
        res.status(500).send("내부 서버 오류");
      } else {
        if (
          results.length > 0 &&
          results[0].nickname === req.session.user.nickname
        ) {
          pool.query("DELETE FROM board WHERE no = ?", [paramsNo], (error) => {
            if (error) {
              console.error("쿼리 실행 중 오류 발생: ", error);
              res.status(500).send("내부 서버 오류");
            } else {
              console.log("게시물 삭제 완료");
              res.redirect("/joy");
            }
          });
        } else {
          res.status(403).send("삭제 권한이 없습니다.");
        }
      }
    }
  );
});

// 게시물 수정 폼
router.get("/joy/update/:no", (req, res) => {
  const paramsNo = req.params.no;

  pool.query(
    "select * from communityjoy where no = ?",
    [paramsNo],
    (error, results) => {
      if (error) {
        console.error("쿼리 실행 중 오류 발생: ", error);
        res.status(500).send("내부 서버 오류");
      } else {
        if (results.length > 0) {
          const board = results[0];
          // 게시물 작성자와 현재 로그인 사용자가 일치하는지 확인
          if (board.nickname === req.session.user.nickname) {
            res.render("joy/update", { board });
          } else {
            res.status(403).send("수정 권한이 없습니다.");
          }
        } else {
          res.status(404).send("게시물을 찾을 수 없습니다.");
        }
      }
    }
  );
});

// 게시물 수정
router.post("/joy/update/:no", (req, res) => {
  const paramsNo = req.params.no;
  const boardTitle = req.body.title;
  const boardContent = req.body.content;
  const boardDate = req.body.created_date || new Date(); // 수정일

  pool.query(
    "update communityjoy set title = ?, content = ?, created_date = ? where no = ?",
    [boardTitle, boardContent, boardDate, paramsNo],
    (error) => {
      if (error) {
        console.error("쿼리 실행 중 오류 발생: ", error);
        res.status(500).send("내부 서버 오류");
      } else {
        console.log("게시물 수정 완료");
        res.redirect("/joy");
      }
    }
  );
});
