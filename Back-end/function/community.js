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
        console.error('데이터베이스 오류:', error);
        res.status(500).json({ error: '서버에서 게시판 데이터를 불러오는 중 오류가 발생했습니다.' });
      } else {
        if (results.length === 0) {
          res.status(404).json({ message: '해당 게시판에 게시물이 없습니다.' });
        } else {
          res.json(results);
        }
      }
    }
  );
};

const insertBoardData = (boardType, title, nickname, content, createdDate, res, redirectUrl) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.log('MySQL Connection Error', err);
      return res.status(500).send('DB 서버 연결 실패');
    }

    conn.query(
      `INSERT INTO community (board_type, title, nickname, content, created_date) VALUES (?, ?, ?, ?, ?)`,
      [boardType, title, nickname, content, createdDate],
      (err, result) => {
        conn.release();
        if (err) {
          console.log('SQL 실행 시 오류 발생', err);
          return res.status(500).send('Query 실패');
        }
        const newPostId = result.insertId;
        res.json({ no: newPostId });
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

const deletePost = (boardType, postId, req, res) => {
  const userNickname = req.session.user.nickname;

  pool.query('SELECT nickname FROM community WHERE no = ?', [postId], (error, results) => {
    if (error) {
      console.error('쿼리 실행 중 오류 발생: ', error);
      res.status(500).send('내부 서버 오류');
    } else {
      if (results.length === 0) {
        res.status(404).send('해당 게시물을 찾을 수 없습니다.');
      } else if (results[0].nickname !== userNickname) {
        res.status(403).send('삭제 권한이 없습니다.');
      } else {
        pool.query('DELETE FROM community WHERE no = ?', [postId], (error) => {
          if (error) {
            console.error('쿼리 실행 중 오류 발생: ', error);
            res.status(500).send('내부 서버 오류');
          } else {
            console.log('게시물 삭제 완료');
            res.sendStatus(204);
          }
        });
      }
    }
  });
};

const getUpdateForm = (postId, boardType, req, res) => {
  pool.getConnection((err, conn) => {
    if (err) {
      console.error('MySQL 연결 오류:', err);
      res.status(500).send('서버 오류');
      return;
    }

    const postQuery = `SELECT * FROM community WHERE no = ? AND board_type = ?`;
    conn.query(postQuery, [postId, boardType], (err, postResult) => {
      conn.release();
      if (err) {
        console.error('게시글 조회 오류:', err);
        res.status(500).send('서버 오류');
        return;
      } else {
        if (postResult.length > 0) {
          const board = postResult[0];
          // 게시물 작성자와 현재 로그인 사용자가 일치하는지 확인
          if (board.nickname === req.session.user.nickname) {
            res.json(board);
          } else {
            res.status(403).send('수정 권한이 없습니다.');
          }
        } else {
          res.status(404).send('게시물을 찾을 수 없습니다.');
        }
      }
    });
  });
};

// 댓글 가져오기
const getComments = (boardNo, boardType, res) => {
  pool.query(
    `SELECT * FROM comments WHERE board_no = ? AND board_type = ? ORDER BY created_date DESC`,
    [boardNo, boardType],
    (error, results) => {
      if (error) {
        console.error('댓글 조회 오류:', error);
        res.status(500).send('서버 오류');
      } else {
        res.json(results);
      }
    }
  );
};

// 댓글 작성 함수
const insertComment = (boardNo, boardType, nickname, content, res) => {
  const createdAt = moment().format('YYYY-MM-DD HH:mm:ss');

  pool.query(
    'INSERT INTO comments (board_no, board_type, nickname, content, created_date) VALUES (?, ?, ?, ?, ?)',
    [boardNo, boardType, nickname, content, createdAt],
    (error, results) => {
      if (error) {
        console.error('댓글 작성 중 오류 발생:', error);
        res.status(500).send('서버 오류');
      } else {
        res.status(201).send('댓글 작성 완료');
      }
    }
  );
};

// 게시판 타입
const boards = ['joy', 'sadness', 'fear', 'anxiety'];
boards.forEach((board) => {
  // 게시판 데이터 가져오기
  router.post('/:board', (req, res) => {
    const board = req.params.board;
    getBoardData(board, res);
  });

  // 새 글 작성하는 링크는 localhost:3000/{보드이름}/new_Post 로 만들어주세요.
  // 새 글 작성
  router.post(`/:board/process/new_Post`, (req, res) => {
    const { title, content } = req.body;
    const nickname = req.session.user.nickname;
    const createdDate = moment().format('YYYY-MM-DD HH:mm:ss');
    insertBoardData(req.params.board, title, nickname, content, createdDate, res, `/${board}`);
  });

  // 상세보기
  router.get('/:board/PostView/:no', (req, res) => {
    const { board, no } = req.params;
    getPostDetails(board, no, req, res);
  });

  // 게시글 삭제
  router.delete('/:board/Postview/:no/process/delete', (req, res) => {
    const { board, no } = req.params;
    deletePost(board, no, req, res);
  });

  // 게시글 수정 폼
  router.get('/:board/Postview/:no/process/update', (req, res) => {
    const { no } = req.params;
    getUpdateForm(no, board, req, res);
  });

  // 게시글 수정
  router.post('/:board/PostView/:no/process/update/', (req, res) => {
    const { title, content, created_date } = req.body;
    const date = moment(created_date || new Date()).format('YYYY-MM-DD HH:mm:ss');
    pool.query(
      `UPDATE community SET title = ?, content = ?, created_date = ? WHERE no = ? AND board_type = ?`,
      [title, content, date, req.params.no, req.params.board],
      (error) => {
        if (error) {
          console.error('쿼리 실행 중 오류 발생: ', error);
          res.status(500).send('내부 서버 오류');
        } else {
          console.log('게시물 수정 완료');
          res.redirect(`/${req.params.board}`);
        }
      }
    );
  });

  // 특정 게시물의 댓글 가져오기
  router.get('/:board/comments/:no', (req, res) => {
    const { no } = req.params;
    getComments(no, board, res);
  });

  // 새로운 댓글 작성
  router.post('/:board/PostView/:no/comments', (req, res) => {
    const { no } = req.params;
    const { content } = req.body;
    const nickname = req.session.user.nickname;

    insertComment(no, board, nickname, content, res);
  });

  router.use('{board}', router);
});

module.exports = router;
