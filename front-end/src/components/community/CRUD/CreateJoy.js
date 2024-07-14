import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './CRUD.css';
import axios from 'axios';
import CRUDHeader from './CRUDHeader';

function CreateJoy() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nextNo } = location.state || {};

  const [board, setBoard] = useState({
    title: '',
    body: '',
  });

  const { title, body } = board;

  const onChange = (event) => {
    const { value, name } = event.target;
    setBoard({
      ...board,
      [name]: value,
    });
  };

  const saveBoard = async (event) => {
    event.preventDefault();
    const newPost = {
      no: nextNo,
      title,
      content: body,
      created_date: new Date().toISOString(),
      board_type: 'joy',
    };

    try {
      const response = await axios.post(`/joy/process/new_Post`, newPost, { withCredentials: true });
      const newPostId = response.data.no;
      console.log('왜안돼', { newPostId }, { newPost }, response.data);
      alert('등록되었습니다.');
      navigate(`/joy/PostView/${newPostId}`, { state: { newPost } });
    } catch (error) {
      console.error('Error saving post:', error);
      alert('글을 저장하는 도중 오류가 발생했습니다.');
    }
  };

  const backToList = () => {
    navigate('/joy');
  };

  return (
    <div className="Create_all">
      <div>
        <div className="header_layout">
          <CRUDHeader title="기쁨이 글쓰기" />
        </div>
        <form onSubmit={saveBoard}>
          <div className="titleBody_layout">
            <div>
              <p>
                <span className="titleBody_name">제목</span>
              </p>
              <input
                className="titleInput"
                type="text"
                name="title"
                placeholder="제목을 입력하세요"
                value={title}
                onChange={onChange}
              />
            </div>
          </div>
          <br />
          <div className="titleBody_layout">
            <div>
              <p>
                <span className="titleBody_name">내용</span>
              </p>
              <textarea name="body" placeholder="내용을 입력하세요" value={body} onChange={onChange}></textarea>
            </div>
          </div>
          <br />
          <div className="btn_layout">
            <button className="backBtn" type="button" onClick={backToList}>
              취소
            </button>
            <input className="CreateBtn" type="submit" value="등록하기"></input>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJoy;
