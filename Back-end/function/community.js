//커뮤니티 게시판
const express = require('express');
const mysql = require('mysql');
const db_config = require('../config/db_config.json');
const moment = require('moment');
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

// 게시판 데이터
const getBoardData = (boardType, res) => {
  pool.query(
    `SELECT no, title, nickname, content, created_date FROM community WHERE board_type = ?`,
    [boardType],
    (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('서버 오류');
      } else {
        res.json(results);
      }
    }
  );
};

const insertBoardData = (boardType, title, nickname, content, createdDate, res, redirectUrl) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.log('MySQL Connection Error', err);
      res.status(500).send('DB 서버 연결 실패');
      return;
    }

    conn.query(
      `INSERT INTO community (board_type, title, nickname, content, created_date) VALUES (?, ?, ?, ?, ?)`,
      [boardType, title, nickname, content, createdDate],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('SQL 실행 시 오류 발생', err);
          res.status(500).send('Query 실패');
          return;
        }
        res.redirect(redirectUrl);
      }
    );
  });
};

const getPostDetails = (boardType, postId, req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error('MySQL 연결 오류:', err);
      res.status(500).send('서버 오류');
      return;
    }

    const postQuery = `SELECT * FROM community WHERE no = ? AND board_type = ?`;
    conn.query(postQuery, [postId, boardType], (err, postResult) => {
      if (err) {
        console.error('게시글 조회 오류:', err);
        conn.release();
        res.status(500).send('서버 오류');
        return;
      }

      const commentQuery = `SELECT * FROM comments WHERE board_no = ? AND board_type = ?`;
      conn.query(commentQuery, [postId, boardType], (err, commentResult) => {
        conn.release();
        if (err) {
          console.error('댓글 조회 오류:', err);
          res.status(500).send('서버 오류');
          return;
        }
        res.json({
          post: postResult[0],
          comments: commentResult,
          session: req.session,
        });
      });
    });
  });
};

const deletePost = (boardType, postId, req, res, redirectUrl) => {
  pool.query(
    `SELECT nickname FROM community WHERE no = ? AND board_type = ?`,
    [postId, boardType],
    (error, results) => {
      if (error) {
        console.error('쿼리 실행 중 오류 발생: ', error);
        res.status(500).send('내부 서버 오류');
        return;
      }

      if (results.length > 0 && results[0].nickname === req.session.user.nickname) {
        pool.query(`DELETE FROM community WHERE no = ? AND board_type = ?`, [postId, boardType], (error) => {
          if (error) {
            console.error('쿼리 실행 중 오류 발생: ', error);
            res.status(500).send('내부 서버 오류');
          } else {
            console.log('게시물 삭제 완료');
            res.redirect(redirectUrl);
          }
        });
      } else {
        res.status(403).send('삭제 권한이 없습니다.');
      }
    }
  );
};

const updatePost = (postId, boardType, title, content, date, res, redirectUrl) => {
  pool.query(
    `UPDATE community SET title = ?, content = ?, created_date = ? WHERE no = ? AND board_type = ?`,
    [title, content, date, postId, boardType],
    (error) => {
      if (error) {
        console.error('쿼리 실행 중 오류 발생: ', error);
        res.status(500).send('내부 서버 오류');
      } else {
        console.log('게시물 수정 완료');
        res.redirect(redirectUrl);
      }
    }
  );
};

// 게시판 타입
const boards = ['joy', 'sadness', 'fear', 'anxiety'];
boards.forEach((board) => {
  // 게시판 데이터 가져오기
  router.post(`/:board`, (req, res) => getBoardData(board, res));

  // 새 글 작성하는 링크는 localhost:3000/{보드이름}/new_Post 로 만들어주세요.
  // 새 글 작성
  router.post(`/:board/process/new_Post`, (req, res) => {
    const { title, content } = req.body;
    const nickname = req.session.user.nickname;
    const createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    insertBoardData(board, title, nickname, content, createdDate, res, `/${board}`);
  });

  // 상세보기
  router.get('/:board/PostView/:no', (req, res) => {
    getPostDetails(board, req.params.no, req, res);
  });

  // 게시글 삭제
  router.post('/:board/Postview/:no/process/delete', (req, res) =>
    deletePost(board, req.params.no, req, res, `/${board}`)
  );

  // 게시글 수정 폼
  router.post('/:board/Postview/:no/process/update', (req, res) => {
    pool.query(`SELECT * FROM community WHERE no = ? AND board_type = ?`, [req.params.no, board], (error, results) => {
      if (error) {
        console.error('쿼리 실행 중 오류 발생: ', error);
        res.status(500).send('내부 서버 오류');
      } else {
        if (results.length > 0) {
          const post = results[0];
          if (post.nickname === req.session.user.nickname) {
            res.render(`${board}/update`, { post });
          } else {
            res.status(403).send('수정 권한이 없습니다.');
          }
        } else {
          res.status(404).send('게시물을 찾을 수 없습니다.');
        }
      }
    });
  });

  // 게시글 수정
  router.post('/:board/PostView/:no/process/update/', (req, res) => {
    const { title, content, created_date } = req.body;
    updatePost(title, content, created_date || new Date(), res, `/${board}`);
  });

  router.use('{board}', router);
});

module.exports = router;
