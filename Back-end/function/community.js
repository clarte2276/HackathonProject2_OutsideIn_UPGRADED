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

// Middleware to check if the user is an admin
const checkAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.isAdmin) {
      next();
    } else {
      res.status(403).send('관리자 권한이 필요합니다.');
    }
  };
  
  // Helper functions
  const getBoardData = (boardType, res) => {
    pool.query(`SELECT no, title, nickname, content, created_date FROM community WHERE board_type = ?`, [boardType], (error, results) => {
      if (error) {
        console.error(error);
        res.status(500).send('서버 오류');
      } else {
        res.json(results);
      }
    });
  };
  
  const insertBoardData = (boardType, title, nickname, content, createdDate, res, redirectUrl) => {
    pool.getConnection((err, conn) => {
      if (err) {
        console.log('MySQL Connection Error', err);
        res.status(500).send('DB 서버 연결 실패');
        return;
      }
      console.log('데이터베이스 연결 성공');
  
      const exec = conn.query(
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
    pool.query(`SELECT nickname FROM community WHERE no = ? AND board_type = ?`, [postId, boardType], (error, results) => {
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
    });
  };
  
  const updatePost = (boardType, postId, title, content, date, res, redirectUrl) => {
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
  
  // Dynamic routes for each board type
  const boards = ['joy', 'sadness', 'fear', 'anxiety'];
  
  boards.forEach(board => {
    // Get board data
    router.post(`/${board}`, (req, res) => getBoardData(board, res));
  
    // Create new post
    router.post(`/CommunityWrite/${board}`, (req, res) => {
      const { title, content } = req.body;
      const nickname = req.session.user.nickname;
      const createdDate = moment().format('YYYY-MM-DD HH');
      insertBoardData(board, title, nickname, content, createdDate, res, `/${board}`);
    });
  
    // Get post details (with comments if applicable)
    router.get(`/${board}/PostView/:no`, (req, res) => {
      getPostDetails(board, req.params.no, req, res);
    });
  
    // Delete post
    router.get(`/${board}/delete/:no`, (req, res) => deletePost(board, req.params.no, req, res, `/${board}`));
  
    // Update post form
    router.get(`/${board}/update/:no`, (req, res) => {
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
  
    // Update post
    router.post(`/${board}/update/:no`, (req, res) => {
      const { title, content, created_date } = req.body;
      updatePost(board, req.params.no, title, content, created_date || new Date(), res, `/${board}`);
    });
  });
  
  // Notice board routes (admin only)
  router.post('/notice', checkAdmin, (req, res) => getBoardData('notice', res));
  router.post('/CommunityWrite/notice', checkAdmin, (req, res) => {
    const { title, content } = req.body;
    const nickname = req.session.user.nickname;
    const createdDate = moment().format('YYYY-MM-DD HH');
    insertBoardData('notice', title, nickname, content, createdDate, res, '/notice');
  });
  router.get('/notice/PostView/:no', checkAdmin, (req, res) => {
    getPostDetails('notice', req.params.no, req, res);
  });
  router.get('/notice/delete/:no', checkAdmin, (req, res) => deletePost('notice', req.params.no, req, res, '/notice'));
  router.get('/notice/update/:no', checkAdmin, (req, res) => {
    pool.query('SELECT * FROM community WHERE no = ? AND board_type = ?', [req.params.no, 'notice'], (error, results) => {
      if (error) {
        console.error('쿼리 실행 중 오류 발생: ', error);
        res.status(500).send('내부 서버 오류');
      } else {
        if (results.length > 0) {
          const post = results[0];
          if (post.nickname === req.session.user.nickname) {
            res.render('notice/update', { post });
          } else {
            res.status(403).send('수정 권한이 없습니다.');
          }
        } else {
          res.status(404).send('게시물을 찾을 수 없습니다.');
        }
      }
    });
  });
  router.post('/notice/update/:no', checkAdmin, (req, res) => {
    const { title, content, created_date } = req.body;
    updatePost('notice', req.params.no, title, content, created_date || new Date(), res, '/notice');
  });

  module.exports = router;