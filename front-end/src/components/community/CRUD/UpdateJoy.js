import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CRUDHeader from './CRUDHeader';
import './CRUD.css';
import axios from 'axios';

function UpdateJoy() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    body: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/joy/Postview/${no}/process/update`)
      .then((response) => {
        const { title, content } = response.data;
        setPost({ title, body: content });
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          alert('수정 권한이 없습니다.');
          navigate(`/joy/PostView/${no}`);
        } else {
          console.error('게시글을 불러오는 중 오류가 발생했습니다!', error);
          setError('게시글을 불러오는 중 오류가 발생했습니다!');
          setLoading(false);
        }
      });
  }, [no]);

  const onChange = (event) => {
    const { value, name } = event.target;
    console.log(`name: ${name}, value: ${value}`);
    setPost({
      ...post,
      [name]: value,
    });
  };

  const updatePost = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/joy/Postview/${no}/process/update`, { title: post.title, content: post.body });
      alert('수정되었습니다.');
      navigate(`/joy/PostView/${no}`);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('수정 권한이 없습니다.');
        navigate(`/joy/PostView/${no}`);
      } else {
        console.error('게시글을 수정하는 중 오류가 발생했습니다:', error);
        alert('게시글을 수정하는 중 오류가 발생했습니다:');
      }
    }
  };

  const backToList = () => {
    navigate(`/joy/PostView/${no}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <>
      <div>
        <CRUDHeader title="기쁨이 글수정" />
      </div>
      <form onSubmit={updatePost}>
        <div>
          <span>제목</span>
          <input type="text" name="title" placeholder="제목" value={post.title} onChange={onChange} />
        </div>
        <br />
        <div>
          <span>내용</span>
          <textarea name="body" placeholder="내용" value={post.body} onChange={onChange}></textarea>
        </div>
        <br />
        <button type="button" onClick={backToList}>
          취소
        </button>
        <input type="submit" value="수정하기"></input>
      </form>
    </>
  );
}

export default UpdateJoy;
